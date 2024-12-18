import { subscribeToMexcSpotPairsList } from "./mexcSymbolsSpot";
import { subscribeToMexcFuturesPairsList } from "./mexcSymbolsFutures";
import { subscribeToBybitPairsList } from "./bybitSymbolsSpot";
import { subscribeToBybitFuturesPairsList } from "./bybitSymbolsFutures";
import type {MexcSpotData} from "./mexcSymbolsSpot";
import type {MexcFuturesData} from "./mexcSymbolsFutures";
import type {FuturesSecondResponseListEntry} from "./bybitSymbolsFutures";
import type {FuturesSecondResponse} from "./bybitSymbolsFutures";
import type {SecondResponseListEntrySpot} from "./bybitSymbolsSpot";
import type {SecondResponseSpot} from "./bybitSymbolsSpot";

async function comparePrices() {
    // Fetch data from APIs
    const [mexcSpot, mexcFutures, bybitSpot, bybitFutures] = await Promise.all([
      subscribeToMexcSpotPairsList(),
      subscribeToMexcFuturesPairsList(),
      subscribeToBybitPairsList(),
      subscribeToBybitFuturesPairsList()
    ]);
  
    // Combine data into a single map by symbol
    const priceMap = new Map<string, { mexc?: MexcSpotData; bybit?: SecondResponseListEntrySpot }>();
  
    // Helper function to add data to the map
    function addToMap(source: SymbolData[], exchange: "mexc" | "bybit") {//не разделяет спот и фьючи?
      for (const data of source) {
        if (!priceMap.has(data.symbol)) {
          priceMap.set(data.symbol, {});
        }
        priceMap.get(data.symbol)![exchange] = data;
      }
    }
  
    // Add data to the map
    addToMap(mexcSpot, "mexc");
    addToMap(mexcFutures, "mexc");//не разделяет спот и фьючи
    addToMap(bybitSpot, "bybit");
    addToMap(bybitFutures, "bybit");
  
    // Compare prices
    for (const [symbol, exchanges] of priceMap.entries()) {
      const mexc = exchanges.mexc;
      const bybit = exchanges.bybit;
  
      if (mexc && bybit) {
        // Compare Mexc spot buy price with Bybit futures sell price
        const diff1 = ((bybit.ask1Price - mexc.bidPrice) / mexc.bidPrice) * 100;
        if (diff1 > 1) {
          console.log(`Symbol: ${symbol}, Mexc Spot Buy: ${mexc.buyPriceSpot}, Bybit Futures Sell: ${bybit.sellPriceFutures}, Difference: ${diff1.toFixed(2)}%`);
        }
  
        // Compare Bybit spot buy price with Mexc futures sell price
        const diff2 = ((mexc.sellPriceFutures - bybit.buyPriceSpot) / bybit.buyPriceSpot) * 100;
        if (diff2 > 1) {
          console.log(`Symbol: ${symbol}, Bybit Spot Buy: ${bybit.buyPriceSpot}, Mexc Futures Sell: ${mexc.sellPriceFutures}, Difference: ${diff2.toFixed(2)}%`);
        }
      }
    }
  }
  
  comparePrices().catch(console.error);
  