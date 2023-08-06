import { CurrencyPair } from "@tradepump/types";

type Amount = string;
type Price = string;

export interface BitstampTradeData {
    amount: number;
    amount_str: string;
    buy_order_id: number;
    id: number;
    // .substring(0, 13)
    microtimestamp: string;
    price: number;
    price_str: number;
    sell_order_id: number;
    timestamp: string;
    /**
     * Trade type (0 - buy; 1 - sell).
     */
    type: number;
}

export interface BitstampBookData {
    asks: [Price, Amount][];
    bids: [Price, Amount][];
    // .substring(0, 13)
    microtimestamp: string;
    timestamp: string;
}

export const bitstampPairs = [
    "btcusd",
    "btceur",
    "btcgbp",
    "btcpax",
    "gbpusd",
    "eurusd",
    "xrpusd",
    "xrpeur",
    "xrpbtc",
    "xrpgbp",
    "ltcbtc",
    "ltcusd",
    "ltceur",
    "ltcgbp",
    "ethbtc",
    "ethusd",
    "etheur",
    "ethgbp",
    "ethpax",
    "bchusd",
    "bcheur",
    "bchbtc",
    "paxusd",
    "xlmbtc",
    "xlmusd",
    "xlmeur",
    "xlmgbp",
    "linkusd",
    "linkeur",
    "linkgbp",
    "linkbtc",
    "usdcusd",
    "usdceur",
    "btcusdc",
    "ethusdc",
    "eth2eth",
    "aaveusd",
    "aaveeur",
    "aavebtc",
    "batusd",
    "bateur",
    "umausd",
    "umaeur",
    "daiusd",
    "kncusd",
    "knceur",
    "mkrusd",
    "mkreur",
    "zrxusd",
    "zrxeur",
    "gusdusd",
    "algousd",
    "algoeur",
    "algobtc",
    "audiousd",
    "audioeur",
    "audiobtc",
    "crvusd",
    "crveur",
    "snxusd",
    "snxeur",
    "uniusd",
    "unieur",
    "unibtc",
    "yfiusd",
    "yfieur",
    "compusd",
    "compeur",
    "grtusd",
    "grteur",
    "lrcusd",
    "lrceur",
    "usdtusd",
    "usdteur",
    "usdcusdt",
    "btcusdt",
    "ethusdt",
    "xrpusdt",
    "eurteur",
    "eurtusd",
    "flrusd",
    "flreur",
    "manausd",
    "manaeur",
    "maticusd",
    "maticeur",
    "sushiusd",
    "sushieur",
    "chzusd",
    "chzeur",
    "enjusd",
    "enjeur",
    "hbarusd",
    "hbareur",
    "alphausd",
    "alphaeur",
    "axsusd",
    "axseur",
    "sandusd",
    "sandeur",
    "storjusd",
    "storjeur",
    "adausd",
    "adaeur",
    "adabtc",
    "fetusd",
    "feteur",
    "sklusd",
    "skleur",
    "slpusd",
    "slpeur",
    "sxpusd",
    "sxpeur",
    "sgbusd",
    "sgbeur",
    "avaxusd",
    "avaxeur",
    "dydxusd",
    "dydxeur",
    "ftmusd",
    "ftmeur",
    "shibusd",
    "shibeur",
    "ampusd",
    "ampeur",
    "ensusd",
    "enseur",
    "galausd",
    "galaeur",
    "perpusd",
    "perpeur",
    "wbtcbtc",
    "ctsiusd",
    "ctsieur",
    "cvxusd",
    "cvxeur",
    "imxusd",
    "imxeur",
    "nexousd",
    "nexoeur",
    "antusd",
    "anteur",
    "godsusd",
    "godseur",
    "radusd",
    "radeur",
    "bandusd",
    "bandeur",
    "injusd",
    "injeur",
    "rlyusd",
    "rlyeur",
    "rndrusd",
    "rndreur",
    "vegausd",
    "vegaeur",
    "1inchusd",
    "1incheur",
    "solusd",
    "soleur",
    "apeusd",
    "apeeur",
    "mplusd",
    "mpleur",
    "eurocusdc",
    "euroceur",
    "dotusd",
    "doteur",
    "nearusd",
    "neareur",
    "ldousd",
    "ldoeur",
    "dgldusd",
    "dgldeur",
    "dogeusd",
    "dogeeur",
    "suiusd",
    "suieur",
] as const;
export type BitstampTradingPair = typeof bitstampPairs[number];

export const isBitstampPair = (pair: any): pair is BitstampTradingPair => bitstampPairs.includes(pair);

export interface BitstampTradesPayload {
    channel: `live_trades_${BitstampTradingPair}`;
    data: BitstampTradeData;
    event: string;
}

export interface BitstampBookPayload {
    channel: `order_book_${BitstampTradingPair}`;
    data: BitstampBookData;
    event: string;
}

export type BitstampPayload = BitstampTradesPayload | BitstampBookPayload;

export const isBitstampPayload = (payload: any): payload is BitstampPayload =>
    typeof payload === "object" &&
    payload !== null &&
    "event" in payload &&
    "data" in payload;

export const isBitstampBookPayload = (payload: BitstampPayload): payload is BitstampBookPayload => payload.channel.startsWith("order_book");

export const bitstampTradepairMap = Object.fromEntries(
    CurrencyPair.map(pair => {
        const convPair = pair.replace(/\//g, "").toLowerCase();
        const bitstampPair = bitstampPairs.find(str => str === convPair);

        return [
            pair,
            bitstampPair
        ];
    }),
) as Record<CurrencyPair, BitstampTradingPair | undefined>;
export const reverseBitstampPairMap = Object.fromEntries(
    CurrencyPair
        .filter(pair => {
            const convPair = pair.replace(/\//g, "").toLowerCase();
            const bitstampPair = bitstampPairs.find(str => str === convPair);

            return !!bitstampPair;
        })
        .map(pair => {
            const convPair = pair.replace(/\//g, "").toLowerCase();
            const bitstampPair = bitstampPairs.find(str => str === convPair);

            return [
                bitstampPair,
                pair,
            ];
        }),
) as Record<BitstampTradingPair, CurrencyPair>;
