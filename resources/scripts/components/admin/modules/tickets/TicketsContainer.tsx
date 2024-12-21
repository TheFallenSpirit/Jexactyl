import tw from 'twin.macro';
import { Link, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import AdminContentBlock from '@elements/AdminContentBlock';
import AdminTable, {
    ContentWrapper,
    Loading,
    NoItems,
    Pagination,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@elements/AdminTable';
import { useGetTickets, Context as TicketContext, TicketStatus } from '@/api/admin/tickets/getTickets';
import { Button } from '@elements/button';
import CopyOnClick from '@elements/CopyOnClick';
import { differenceInHours, format, formatDistanceToNow } from 'date-fns';
import classNames from 'classnames';
import { useStoreState } from '@/state/hooks';
import ToggleTicketsButton from './ToggleTicketsButton';

export const statusToColor = (status: TicketStatus): string => {
    switch (status) {
        case 'in-progress':
            return 'bg-yellow-200 text-yellow-800';
        case 'unresolved':
            return 'bg-red-200 text-red-800';
        case 'resolved':
            return 'bg-green-200 text-green-800';
        default:
            return 'bg-gray-400 text-gray-800';
    }
};

export default () => {
    const { data: tickets } = useGetTickets();
    const { colors } = useStoreState(state => state.theme.data!);
    const { setPage, setFilters, sort, setSort, sortDirection } = useContext(TicketContext);

    const onSearch = (query: string): Promise<void> => {
        return new Promise(resolve => {
            if (query.length < 2) {
                setFilters(null);
            } else {
                // setFilters({ title: query });
            }
            return resolve();
        });
    };

    return (
        <AdminContentBlock title={'Tickets'}>
            <div className={'w-full flex flex-row items-center mb-8'}>
                <div className={'flex flex-col flex-shrink'} style={{ minWidth: '0' }}>
                    <h2 className={'text-2xl text-neutral-50 font-header font-medium'}>Tickets</h2>
                    <p
                        className={
                            'hidden lg:block text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden'
                        }
                    >
                        Update settings and manage user tickets.
                    </p>
                </div>
                <div css={tw`flex ml-auto pl-4`}>
                    <ToggleTicketsButton />
                    <Link to={'/admin/tickets/new'}>
                        <Button>New Ticket</Button>
                    </Link>
                </div>
            </div>
            <AdminTable>
                <ContentWrapper onSearch={onSearch}>
                    <Pagination data={tickets} onPageSelect={setPage}>
                        <div css={tw`overflow-x-auto`}>
                            <table css={tw`w-full table-auto`}>
                                <TableHead>
                                    <TableHeader
                                        name={'ID'}
                                        direction={sort === 'id' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('id')}
                                    />
                                    <TableHeader
                                        name={'Title'}
                                        direction={sort === 'title' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('title')}
                                    />
                                    <TableHeader
                                        name={'Created At'}
                                        direction={sort === 'created_at' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('created_at')}
                                    />
                                    <TableHeader
                                        name={'Status'}
                                        direction={sort === 'status' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('status')}
                                    />
                                </TableHead>
                                <TableBody>
                                    {tickets !== undefined &&
                                        tickets.items.length > 0 &&
                                        tickets.items.map(ticket => (
                                            <TableRow key={ticket.id}>
                                                <td css={tw`px-6 text-sm text-neutral-200 text-left whitespace-nowrap`}>
                                                    <CopyOnClick text={ticket.id}>
                                                        <code css={tw`font-mono bg-neutral-900 rounded py-1 px-2`}>
                                                            {ticket.id}
                                                        </code>
                                                    </CopyOnClick>
                                                </td>
                                                <td css={tw`px-6 text-sm text-neutral-200 text-left whitespace-nowrap`}>
                                                    <NavLink
                                                        to={`/admin/tickets/${ticket.id}`}
                                                        style={{ color: colors.primary }}
                                                        className={'hover:brightness-125 duration-300'}
                                                    >
                                                        {ticket.title}
                                                    </NavLink>
                                                </td>
                                                <td css={tw`px-6 text-sm text-neutral-200 text-left whitespace-nowrap`}>
                                                    {Math.abs(differenceInHours(ticket.createdAt, new Date())) > 48
                                                        ? format(ticket.createdAt, 'MMM do, yyyy h:mma')
                                                        : formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
                                                </td>
                                                <td css={tw`px-6 text-sm text-neutral-200 text-left whitespace-nowrap`}>
                                                    <span
                                                        className={classNames(
                                                            statusToColor(ticket.status),
                                                            'capitalize px-2 inline-flex text-xs leading-5 font-medium rounded-full',
                                                        )}
                                                    >
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </table>

                            {tickets === undefined ? <Loading /> : tickets.items.length < 1 ? <NoItems /> : null}
                        </div>
                    </Pagination>
                </ContentWrapper>
            </AdminTable>
        </AdminContentBlock>
    );
};