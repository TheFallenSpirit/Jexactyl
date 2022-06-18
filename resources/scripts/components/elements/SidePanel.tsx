import React from 'react';
import tw from 'twin.macro';
import http from '@/api/http';
import * as Icon from 'react-feather';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components/macro';
import { NavLink, Link } from 'react-router-dom';
import ProgressBar from '@/components/elements/ProgressBar';
import SearchContainer from '@/components/dashboard/search/SearchContainer';

export default () => {
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const store = useStoreState(state => state.storefront.data!.enabled);
    const logo = useStoreState(state => state.settings.data!.logo);

    const onTriggerLogout = () => {
        http.post('/auth/logout').finally(() => {
            // @ts-ignore
            window.location = '/';
        });
    };

    const PanelDiv = styled.div`
        ${tw`h-screen sticky bg-neutral-900 flex flex-col w-28 fixed top-0`};
    `;

    return (
        <PanelDiv>
            <ProgressBar/>
            <div id={'logo'}>
                <Link to={'/'}>
                    <img
                        css={tw`p-4`}
                        src={logo ?? 'https://camo.githubusercontent.com/a7f9ce191b39dbb9c33372a2df125c4171e2908420a6d6d8429d37af82804a37/68747470733a2f2f63646e2e707465726f64616374796c2e696f2f736974652d6173736574732f6c6f676f2d69636f6e2e706e67'}
                    />
                </Link>
            </div>
            <div css={tw`mx-auto mb-6`} className={'navigation-link'}>
                <SearchContainer size={32} />
            </div>
            <NavLink to={'/'} css={tw`mx-auto my-6`} className={'navigation-link'}>
                <Icon.Server size={32} />
            </NavLink>
            <NavLink to={'/account'} css={tw`mx-auto my-6`} className={'navigation-link'}>
                <Icon.User size={32} />
            </NavLink>
            {store === 'true' &&
                <NavLink to={'/store'} css={tw`mx-auto my-6`} className={'navigation-link'}>
                    <Icon.ShoppingCart size={32} />
                </NavLink>
            }
            {rootAdmin &&
                <a href={'/admin'} css={tw`mx-auto my-6`} className={'navigation-link'}>
                    <Icon.Settings size={32} />
                </a>
            }
            <div id={'logo'}>
                <button
                    title={'Logout'}
                    onClick={onTriggerLogout}
                    css={tw`flex flex-row mx-auto my-6`}
                    className={'navigation-link'}
                >
                    <Icon.LogOut size={32} />
                </button>
            </div>
        </PanelDiv>
    );
};