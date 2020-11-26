import React, {Component} from "react";

import moment from "moment";

import axios from "axios";

import numeral from "numeral";

import Graph from "react-chartist";

import {ILineChartOptions} from "chartist";

import isEqual from "react-fast-compare";

import {_t} from "../../i18n";

export const getMarketData = (coin: string, vsCurrency: string, fromTs: string, toTs: string) => {
    const u = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart/range?vs_currency=${vsCurrency}&from=${fromTs}&to=${toTs}`
    return axios.get(u).then(r => r.data);
}

interface Props {
    label: string;
    coin: string;
    vsCurrency: string;
    fromTs: string;
    toTs: string;
}

interface State {
    series: number[]
}

export class Market extends Component<Props, State> {
    state: State = {
        series: []
    }

    componentDidMount() {
        const {coin, vsCurrency, fromTs, toTs} = this.props;

        getMarketData(coin, vsCurrency, fromTs, toTs).then((r) => {
            if (r.prices) {
                const series = r.prices.map((x: any) => x[1]);
                this.setState({series});
            }
        });
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>): boolean {
        return !isEqual(this.state, nextState);
    }

    render() {
        const {series} = this.state;
        if (series.length === 0) {
            return null;
        }

        const options: ILineChartOptions = {
            width: "100%",
            height: "90px",
            showPoint: false,
            showArea: true,
            lineSmooth: false,
            fullWidth: true,
            chartPadding: {
                right: 0,
                left: -40,
                top: 0,
                bottom: -40,
            },
            axisX: {
                showLabel: false,
                showGrid: false
            },
            axisY: {
                showLabel: false,
                showGrid: false
            }
        };

        const data = {
            series: [series]
        };

        const {coin, label} = this.props;
        const price = series[series.length - 1];

        const formatter = coin === "bitcoin" ? ",$" : "0.00$";
        const strPrice = numeral(price).format(formatter)

        return <div className="market-graph">
            <Graph data={data} options={options} type="Line"/>
            <div className="price"><span className="coin">{label}</span>{" "}<span className="value">{strPrice}</span></div>
        </div>;
    }
}

export default class MarketData extends Component {
    render() {
        const fromTs = moment().subtract(2, "days").format("X");
        const toTs = moment().format("X");

        return <div className="market-data">
            <div className="market-data-header">{_t("market-data.title")}</div>
            <Market label="HIVE" coin="hive" vsCurrency="usd" fromTs={fromTs} toTs={toTs}/>
            <Market label="HBD" coin="hive_dollar" vsCurrency="usd" fromTs={fromTs} toTs={toTs}/>
            <Market label="BTC" coin="bitcoin" vsCurrency="usd" fromTs={fromTs} toTs={toTs}/>
        </div>
    }
}
