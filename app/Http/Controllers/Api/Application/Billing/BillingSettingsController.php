<?php

namespace Everest\Http\Controllers\Api\Application\Billing;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Everest\Facades\Activity;
use Everest\Contracts\Repository\SettingsRepositoryInterface;
use Everest\Http\Controllers\Api\Application\ApplicationApiController;

class BillingSettingsController extends ApplicationApiController
{
    /**
     * BillingSettingsController constructor.
     */
    public function __construct(
        private SettingsRepositoryInterface $settings
    ) {
        parent::__construct();
    }

    /**
     * Update the billing settings for the Panel.
     *
     * @throws \Throwable
     */
    public function update(Request $request): Response
    {
        $this->settings->set('settings::modules:billing:' . $request->input('key'), $request->input('value'));

        Activity::event('admin:billing:update')
            ->property('settings', $request->all())
            ->description('Jexactyl Billing settings were updated')
            ->log();

        return $this->returnNoContent();
    }
}