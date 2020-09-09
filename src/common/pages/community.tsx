import React, {Component, Fragment} from "react";

import {connect} from "react-redux";

import {match} from "react-router";

import {FormControl} from "react-bootstrap";

import {Community} from "../store/communities/types";

import Meta from "../components/meta";
import Theme from "../components/theme/index";
import NavBar from "../components/navbar/index";
import LinearProgress from "../components/linear-progress";
import CommunityCard from "../components/community-card";
import CommunityMenu from "../components/community-menu";
import ProfileCover from "../components/profile-cover";

import {_t} from "../i18n";
import capitalize from "../util/capitalize";
import {getCommunity, getSubscriptions} from "../api/bridge";
import {getAccount, getAccountFull} from "../api/hive";

import {PageProps, pageMapDispatchToProps, pageMapStateToProps} from "./common";
import NotFound from "../components/404";
import defaults from "../constants/defaults.json";
import Feedback from "../components/feedback";
import {makeGroupKey} from "../store/entries";
import _c from "../util/fix-class-names";
import {ListStyle} from "../store/global/types";
import EntryListLoadingItem from "../components/entry-list-loading-item";
import EntryListContent from "../components/entry-list";
import DetectBottom from "../components/detect-bottom";
import isEqual from "react-fast-compare";

interface MatchParams {
    filter: string;
    name: string;
}

interface Props extends PageProps {
    match: match<MatchParams>;
}

interface State {
    loading: boolean;
}

class CommunityPage extends Component<Props, State> {
    state: State = {
        loading: false
    };

    _mounted: boolean = true;

    async componentDidMount() {
        await this.ensureData();

        const {match, fetchEntries} = this.props;
        fetchEntries(match.params.filter, match.params.name, false);
    }

    componentDidUpdate(prevProps: Readonly<Props>): void {
        const {location, match, fetchEntries} = this.props;
        const {location: prevLocation} = prevProps;

        // location (community or filter) changed. re-fetch
        if (!isEqual(location, prevLocation)) {
            this.ensureData().then(() => {
                fetchEntries(match.params.filter, match.params.name, false);
            });
        }
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    stateSet = (state: {}, cb?: () => void) => {
        if (this._mounted) {
            this.setState(state, cb);
        }
    };

    ensureData = (): Promise<void> => {
        const {match, communities, addCommunity, accounts, addAccount} = this.props;

        const name = match.params.name;
        const community = communities.find((x) => x.name === name);
        const account = accounts.find((x) => x.name === name);

        if (!community || !account) {
            // Community or account data aren't in reducer. Show loading indicator.
            this.stateSet({loading: true});
        }

        return getCommunity(name).then((data) => {
            if (data) {
                addCommunity(data);
            }
            return getAccountFull(name);
        }).then((data) => {
            if (data.name === name) {
                addAccount(data);
            }
        }).finally(() => {
            this.stateSet({loading: false});
        });
    }

    bottomReached = () => {
        const {match, entries, fetchEntries} = this.props;
        const {filter, name} = match.params;
        const groupKey = makeGroupKey(filter, name);

        const data = entries[groupKey];
        const {loading, hasMore} = data;

        if (!loading && hasMore) {
            fetchEntries(filter, name, true);
        }
    };

    render() {
        const {global, entries, communities, accounts, match} = this.props;
        const {loading} = this.state;

        if (loading) {
            return <LinearProgress/>;
        }

        const {name, filter} = match.params;

        const community = communities.find((x) => x.name === name);
        const account = accounts.find((x) => x.name === name);

        if (!community || !account) {
            return <NotFound/>;
        }

        //  Meta config
        const fC = capitalize(filter);
        const title = `${community.title.trim()}`;
        const description = _t("community.page-description", {f: `${fC} ${community.title.trim()}`});
        const url = `${defaults.base}/${filter}/${community.name}`;
        const rss = `${defaults.base}/${filter}/${community.name}/rss.xml`;

        const metaProps = {title, description, url, rss};

        const promoted = entries['__promoted__'].entries;

        return (
            <>
                <Meta {...metaProps} />
                <Theme global={this.props.global}/>
                <Feedback/>
                {NavBar({...this.props})}
                <div className="app-content community-page">
                    <div className="profile-side">
                        {CommunityCard({
                            ...this.props,
                            community
                        })}
                    </div>
                    <div className="content-side">
                        {CommunityMenu({
                            ...this.props,
                            community
                        })}

                        {ProfileCover({
                            ...this.props,
                            account
                        })}

                        {(() => {
                            const groupKey = makeGroupKey(filter, name);
                            const data = entries[groupKey];

                            if (data !== undefined) {
                                const entryList = data?.entries;
                                const loading = data?.loading;

                                return (
                                    <>
                                        <div className={_c(`entry-list ${loading ? "loading" : ""}`)}>
                                            <div className={_c(`entry-list-body ${global.listStyle === ListStyle.grid ? "grid-view" : ""}`)}>
                                                {loading && entryList.length === 0 && <EntryListLoadingItem/>}
                                                {EntryListContent({...this.props, entries: entryList, promotedEntries: promoted, community})}
                                            </div>
                                        </div>
                                        {loading && entryList.length > 0 ? <LinearProgress/> : ""}
                                        <DetectBottom onBottom={this.bottomReached}/>
                                    </>
                                );
                            }

                            return null;
                        })()}
                    </div>
                </div>
            </>
        )
    }
}

export default connect(pageMapStateToProps, pageMapDispatchToProps)(CommunityPage);
