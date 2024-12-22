import { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import PageContentBlock from '@elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@elements/Pagination';
import { Link, useLocation } from 'react-router-dom';
import ContentBox from '@elements/ContentBox';
import FlashMessageRender from '../FlashMessageRender';
import NotFoundSvg from '@/assets/images/not_found.svg';
import DashboardAlert from '@/components/dashboard/DashboardAlert';
import ServerSvg from '@/assets/images/themed/ServerSvg';
import { Button } from '@elements/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faList, faShield } from '@fortawesome/free-solid-svg-icons';
import { getServerGroups, ServerGroup } from '@/api/server/groups';
import ServerGroupDialog, { VisibleDialog } from '@/components/dashboard/groups/ServerGroupDialog';

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [open, setOpen] = useState<VisibleDialog>({ open: 'none', serverId: undefined });
    const colors = useStoreState(state => state.theme.data!.colors);
    const [groups, setGroups] = useState<ServerGroup[]>([]);
    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const name = useStoreState(state => state.settings.data!.name);
    const uuid = useStoreState(state => state.user.data!.uuid);
    const user = useStoreState(state => state.user.data!);
    const billing = useStoreState(state => state.everest.data!.billing.enabled);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && user.rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && user.rootAdmin ? 'admin' : undefined, per_page: 5 }),
    );

    useEffect(() => {
        getServerGroups()
            .then(data => setGroups(data))
            .catch(() => console.error());
    }, []);

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    return (
        <PageContentBlock title={'Dashboard'}>
            <DashboardAlert />
            {open && <ServerGroupDialog open={open} setOpen={setOpen} groups={groups} setGroups={setGroups} />}
            <div className={'text-3xl lg:text-5xl font-bold mt-8 mb-12'}>
                Welcome to {name}
                <p className={'text-gray-400 font-normal text-sm mt-1'}>Signed in as {user.email}</p>
            </div>
            <FlashMessageRender className={'my-4'} byKey={'dashboard'} />
            <div className={'grid lg:grid-cols-3 gap-4'}>
                <div className="relative overflow-x-auto lg:col-span-2">
                    <h2 css={tw`text-neutral-300 mb-4 px-4 text-2xl flex justify-between`}>
                        <div className={'inline-flex'}>
                            {user.rootAdmin && (
                                <div className={'mr-3 mt-1.5'}>
                                    <Switch
                                        name={'show_all_servers'}
                                        defaultChecked={showOnlyAdmin}
                                        onChange={() => setShowOnlyAdmin(s => !s)}
                                    />
                                </div>
                            )}
                            {showOnlyAdmin ? 'Other' : 'Your'} Servers
                        </div>
                        <Button.Text size={Button.Sizes.Small} className={'mt-1'}>
                            <FontAwesomeIcon icon={faList} onClick={() => setOpen({ open: 'index' })} />
                        </Button.Text>
                    </h2>
                    <ContentBox>
                        {!servers || servers.items.length < 1 ? (
                            <div className={'text-gray-400'}>
                                <div className={'grid lg:grid-cols-2 gap-6 m-4'}>
                                    <ServerSvg color={colors.primary} />
                                    <div>
                                        <h1 className={'text-gray-200 text-2xl font-bold'}>Deploy your first server</h1>
                                        <div className={'mt-2'}>
                                            It looks like you have no servers deployed to your account.&nbsp;
                                            {billing ? (
                                                <>
                                                    With our billing portal, you can configure and purchase a new server
                                                    plan and choose options like amount of CPU, memory and which game
                                                    you&apos;d like to run.
                                                    <div className={'text-right'}>
                                                        <Link to={'/billing/order'}>
                                                            <Button className={'w-1/2 text-white font-normal'}>
                                                                View Options{' '}
                                                                <FontAwesomeIcon
                                                                    icon={faCircleArrowRight}
                                                                    className={'ml-2'}
                                                                />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </>
                                            ) : (
                                                <>Think this is a mistake? Please contact our support team.</>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Pagination data={servers} onPageSelect={setPage}>
                                {({ items }) =>
                                    items.length > 0 ? (
                                        items.map((server, _index) => (
                                            <>
                                                <ServerRow
                                                    key={server.uuid}
                                                    server={server}
                                                    setOpen={setOpen}
                                                    group={groups.find(x => x.id === server.groupId)}
                                                />
                                            </>
                                        ))
                                    ) : (
                                        <div className={'w-full'} style={{ backgroundColor: colors.secondary }}>
                                            <div className={'px-6 py-4 text-gray-300'}>
                                                <div css={tw`flex justify-center`}>
                                                    <div
                                                        css={tw`w-full sm:w-3/4 md:w-1/2 rounded-lg text-center relative`}
                                                    >
                                                        <img
                                                            src={NotFoundSvg}
                                                            css={tw`w-2/3 h-auto select-none mx-auto`}
                                                        />
                                                        <h2 css={tw`mt-10 mb-6 text-white font-medium text-xl`}>
                                                            No servers could be found.
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </Pagination>
                        )}
                    </ContentBox>
                </div>
                <ContentBox title={'Account Summary'}>
                    <div className={'grid grid-cols-2'}>
                        <div className={'w-full h-full border-b-2 border-gray-400 border-r-2'}>
                            <div className={'text-center text-gray-400 text-sm py-12'}>
                                <h1 className={'text-3xl lg:text-5xl text-white font-bold'}>
                                    <span className={user.useTotp ? 'text-green-400' : 'text-red-400'}>
                                        <FontAwesomeIcon icon={faShield} /> 2FA
                                    </span>
                                </h1>
                                <div className={'mt-2 italic'}>2-factor is {user.useTotp ? 'enabled' : 'disabled'}</div>
                            </div>
                        </div>
                        <div className={'w-full h-full'}>
                            <div className={'text-center text-gray-400 text-sm py-12'}>
                                <h1 className={'text-3xl lg:text-5xl text-white font-bold'}>{servers?.items.length}</h1>
                                <div className={'mt-1 italic'}>total server count</div>
                            </div>
                        </div>
                        <div className={'w-full h-full'}>
                            <div className={'text-center text-gray-400 text-sm py-12'}>
                                <h1 className={'text-3xl lg:text-5xl text-white font-bold'}>---</h1>
                                <div className={'mt-1 italic'}>pending orders</div>
                            </div>
                        </div>
                        <div className={'w-full h-full border-gray-400 border-t-2 border-l-2'}>
                            <div className={'text-center text-gray-400 text-sm py-12'}>
                                <h1 className={'text-3xl lg:text-5xl text-white font-bold'}>---</h1>
                                <div className={'mt-1 italic'}>unread tickets</div>
                            </div>
                        </div>
                    </div>
                </ContentBox>
            </div>
        </PageContentBlock>
    );
};
