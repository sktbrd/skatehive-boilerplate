import React, { useEffect, useState } from 'react';
import { NavBar } from '../components/navbar';
import NavBarElectron from "../../desktop/app/components/navbar";
import { connect } from 'react-redux';
import { pageMapDispatchToProps, pageMapStateToProps, PageProps } from './common';
import { ChartStats } from '../components/chart-stats';
import { HiveBarter } from '../components/hive-barter';
import { getMarketStatistics, getOpenOrder, getOrderBook, getTradeHistory, MarketStatistics, OpenOrdersData, OrdersData } from '../api/hive';
import { FullAccount } from '../store/accounts/types';
import { Orders } from '../components/orders';
import { OpenOrders } from '../components/open-orders';
import { MarketChart } from '../components/market-chart';

const MarketPage = (props: PageProps) => {
    const [data, setData] = useState<MarketStatistics | null>(null);
    const [loading, setLoading] = useState(false);
    const [openOrdersdata, setopenOrdersdata] = useState<OpenOrdersData[]>([]);
    const [openOrdersDataLoading, setopenOrdersDataLoading] = useState(false);
    const [tablesData, setTablesData] = useState<OrdersData | null>(null);
    const [loadingTablesData, setLoadingTablesData] = useState(false);
    const {global, activeUser} = props;

    useEffect(()=>{
        setLoading(true);
        setLoadingTablesData(true);
        setopenOrdersDataLoading(true)
        getMarketStatistics().then(res=>{
            setLoading(false);
            setData(res)
        });
        getOrderBook().then(res => {
            getTradeHistory().then(trading => {
                setLoadingTablesData(false);
                setTablesData({...res, trading});
            })});
        activeUser && getOpenOrder(activeUser.username).then(res=>{
            setopenOrdersdata(res);
            setopenOrdersDataLoading(false);
        })
        
    }, []);
    
    let navbar = global.isElectron ?
        NavBarElectron({
            ...props,
            reloadFn: () => {},
            reloading: false,
        }) : <NavBar {...props} />;
        let series1 = tablesData ? tablesData!.bids.map((item, index) => {
            return parseFloat((item.hbd/1000).toFixed(5))
        } ) : [];
        series1 = series1.filter((item, index) => index % 10 == 0)

        let series2 = tablesData ? tablesData!.asks.map((item, index) => parseFloat((item.hbd/1000).toFixed(5))) : [];
        series2 = series2.filter((item, index) => index % 10 == 0);
    return <>
            <div className="d-flex justify-content-center">
                <div className="w-75">
                    <div>{navbar}</div>
                    <div style={{marginTop: 70}}>
                        <ChartStats data={data} loading={loading} />
                    </div>

                    {(data && tablesData) ? <MarketChart data1={series1} data2={series2} /> : "Loading..."}
                    <div className="container my-3">
                        <div className="row justify-content-between">
                            <div className="col-12 col-sm-5 p-0">
                                <HiveBarter
                                    type={1}
                                    available={activeUser && (activeUser.data as FullAccount).balance || ""}
                                    peakValue={data? parseFloat(data!.lowest_ask) :0}
                                    loading={loading}
                                />
                            </div>
                            <div className="col-12 col-sm-5 p-0">
                                <HiveBarter
                                    type={2}
                                    available={activeUser && (activeUser.data as FullAccount).hbd_balance || ""}
                                    peakValue={data? parseFloat(data!.highest_bid) :0}
                                    loading={loading}
                                />
                            </div>
                        </div>

                        <div className="row mt-5">
                            <div className="col-12 col-lg-6 pl-sm-0"><Orders type={1} loading={loadingTablesData} data={tablesData ? tablesData!.bids : []}/></div>
                            <div className="col-12 col-lg-6 pl-0 pl-sm-auto"><Orders type={2} loading={loadingTablesData} data={tablesData ? tablesData!.asks : []}/></div>
                            <div className="col-12 px-0 px-sm-auto mt-5"><Orders type={3} loading={loadingTablesData} data={tablesData ? tablesData!.trading : []}/></div>
                            <div className="col-12 px-0 mt-5"><OpenOrders data={openOrdersdata || []} loading={openOrdersDataLoading} /></div>
                        </div>

                    </div>
                </div>
            </div>
        </>
}

export default connect(pageMapStateToProps, pageMapDispatchToProps)(MarketPage as any);