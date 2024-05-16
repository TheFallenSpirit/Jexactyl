<?php

namespace Everest\Http\Controllers\Api\Client\Billing;

use Ramsey\Uuid\Uuid;
use Everest\Models\Node;
use Illuminate\Http\Request;
use Laravel\Cashier\Cashier;
use Everest\Models\Billing\Product;
use Illuminate\Http\RedirectResponse;
use Everest\Models\Billing\BillingPlan;
use Everest\Services\Billing\CreateServerService;
use Everest\Services\Billing\CreateBillingPlanService;
use Everest\Http\Controllers\Api\Client\ClientApiController;
use Everest\Repositories\Wings\DaemonConfigurationRepository;
use Everest\Exceptions\Http\Connection\DaemonConnectionException;

class OrderController extends ClientApiController
{
    public function __construct(
        private CreateServerService $serverCreation,
        private CreateBillingPlanService $planCreation,
        private DaemonConfigurationRepository $repository,
    ) {
        parent::__construct();
    }

    /**
     * Order a new product.
     */
    public function order(Request $request, int $id): string
    {
        $product = Product::findOrFail($id);
        $node = Node::findOrFail($request->input('node'));

        $data = $this->repository->setNode($node)->getSystemInformation();

        if (!$data['version']) {
            throw new DaemonConnectionException();
        };

        return $this->generateStripeUrl($request, $product);
    }

    /**
     * Get the Stripe Checkout URL for payment.
     */
    private function generateStripeUrl(Request $request, Product $product): string
    {
        $session = $request
            ->user()
            ->newSubscription(substr(Uuid::uuid4()->toString(), 0, 8), $product->stripe_id)
            ->checkout([
                'success_url' => route('api:client.billing.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('api:client.billing.cancel') . '?session_id={CHECKOUT_SESSION_ID}',
                'metadata' => [
                    'node_id' => $request->input('node'),
                    'user_id' => $request->user()->id,
                    'product_id' => $product->id,
                    'username' => $request->user()->username,
                    'environment' => json_encode($request->input('data')),
                ],
            ])
            ->url;

        return $session;
    }

    /**
     * Process a successful subscription purchase.
     */
    public function success(Request $request): RedirectResponse|null
    {
        $id = $request->get('session_id');

        $session = Cashier::stripe()->checkout->sessions->retrieve($id);

        if (!$session) {
            if ($session->payment_status !== 'paid') {
                $this->planCreation->process(
                    $request,
                    $product,
                    BillingPlan::STATUS_CANCELLED,
                );
            }

            return redirect('/billing/cancel');
        }

        $product = Product::findOrFail($session['metadata']['product_id']);

        $server = $this->serverCreation->process($request, $product, $session['metadata']);

        $this->planCreation->process($session['metadata']['user_id'], $product, $server, BillingPlan::STATUS_PAID);

        return redirect('/billing/success');
    }

    /**
     * Process a cancelled subscription purchase.
     */
    public function cancel(Request $request): RedirectResponse
    {
        $id = $request->get('session_id');

        $session = Cashier::stripe()->checkout->sessions->retrieve($id);

        if (!$session) {
            return redirect('/');
        }

        $product = Product::findOrFail($session['metadata']['product_id']);

        $this->planCreation->process(
            $session['metadata']['user_id'],
            $product,
            null,
            BillingPlan::STATUS_CANCELLED,
        );

        return redirect('/billing/cancel');
    }
}