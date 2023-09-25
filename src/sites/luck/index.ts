import got from "got";
import {
  categoriesInfo,
  tournament,
  basicInfo,
  betsInfo,
  betData,
  oddsOutcome,
  compattate,
  matchData,
  bet,
  scommesse,
} from "./types";
import data from "./data.json";
import liveData from "./liveData.json";
const ASIAN_HANDICAP = [
  60016, 4561, 6511, 6515, 6676, 1127, 7844, 7846, 7486, 4813, 1126, 11442,
  5373,
];
export const HANDICAP_TYPES_TO_SORT_BY_DESC = [35, 38];

//this file contains a lot of :any types because I had to replicate/copy some functions from their website
// since they had a complicated way to calculate their odds, in order to add more security

export default class luck {
  http;
  constructor() {
    this.http = got.extend({
      throwHttpErrors: false,
      timeout: 2000,
    });
  }

  async fetchCategories() {
    const response = await this.http.get(
      "https://sport.luck.com/XSportDatastoreRomania/getMenuPrematch?systemCode=LUCKY&lingua=RO&hash=",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.5",
          "sec-ch-ua":
            '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "sec-gpc": "1",
          Referer: "https://pariuri.luck.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
      }
    );

    if (response.statusCode != 200) {
      throw new Error(`[${response.statusCode}] ${response.body}`);
    }

    return JSON.parse(response.body) as categoriesInfo;
  }

  async fetchDailyEvents(
    sportId: string,
    categoryId: string,
    tournamentId: string,
    idAggregata: string
  ) {
    const response = await this.http.get(
      `https://sport.luck.com/XSportDatastoreRomania/getTorneoCentrale?systemCode=LUCKY&lingua=RO&hash=&sportId=${sportId}&categoryId=${categoryId}&tournamentId=${tournamentId}&idAggregata=${idAggregata}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.5",
          "sec-ch-ua":
            '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "sec-gpc": "1",
          Referer: "https://pariuri.luck.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
      }
    );

    if (response.statusCode != 200) {
      throw new Error(`[${response.statusCode}] ${response.body}`);
    }

    return JSON.parse(response.body) as basicInfo;
  }

  async fetchBets(pal: string, avv: string, idAggregata: string) {
    const response = await this.http.get(
      `https://sport.luck.com/XSportDatastoreRomania/getEvento?systemCode=LUCKY&lingua=RO&hash=&pal=${pal}&avv=${avv}&idAggregata=${idAggregata}&isLive=false`,
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "accept-language": "en-US,en;q=0.5",
          "cache-control": "max-age=0",
          "sec-ch-ua":
            '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "sec-gpc": "1",
          "upgrade-insecure-requests": "1",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
      }
    );

    if (response.statusCode != 200) {
      throw new Error(`[${response.statusCode}] ${response.body}`);
    }
    return JSON.parse(response.body) as betsInfo;
  }

  deepCopyOdds(odds: string | any[]) {
    const newOdds = [];
    for (let i = 0; i < odds.length; i++) {
      const odd = odds[i];
      // Deep copy odd
      let newOdd = {
        id: odd.id,
        desc: odd.desc,
        ranking: odd.ranking,
        value: odd.value,
        tooltip: odd.tooltip,
        betId: odd.betId,
        aliasListDefault: odd.aliasListDefault,
        aliasByHandicap: odd.aliasByHandicap,
        aliasBySystemCode: odd.aliasBySystemCode,
        aliasHandicapBySystemCode: odd.aliasHandicapBySystemCode,
      };
      if (odd.aliasByHandicap != null) {
        newOdd.aliasByHandicap = {};
        for (let kh in odd.aliasByHandicap) {
          newOdd.aliasByHandicap[kh] = odd.aliasByHandicap[kh];
        }
      }
      newOdds.push(newOdd);
    }
    return newOdds;
  }

  deepCopyBet(bet: {
    id: any;
    desc: any;
    ranking: any;
    parametrica: any;
    handicap: any;
    tipoHandicap: any;
    calculateHandicapDescription: any;
    handicapTableDesc: any;
    legabile: any;
    odds: any;
    forceAntepost: any;
    liveTimer: any;
    mainLine: any;
    hideHandicap: any;
    aggId: any;
    aggDesc: any;
  }) {
    return {
      id: bet.id,
      desc: bet.desc,
      ranking: bet.ranking,
      parametrica: bet.parametrica,
      handicap: bet.handicap,
      tipoHandicap: bet.tipoHandicap,
      calculateHandicapDescription: bet.calculateHandicapDescription,
      handicapTableDesc: bet.handicapTableDesc,
      legabile: bet.legabile,
      odds: this.deepCopyOdds(bet.odds),
      forceAntepost: bet.forceAntepost,
      liveTimer: bet.liveTimer,
      mainLine: bet.mainLine,
      hideHandicap: bet.hideHandicap,
      aggId: bet.aggId,
      aggDesc: bet.aggDesc,
    };
  }

  deepCopyBetGroup(agg: {
    scommesse: any;
    idAggregata: any;
    descrizione: any;
    ranking: any;
    isPrincipale: any;
    compattate: any;
    localeCmpDesc: any;
    sportId: any;
  }) {
    const bets = agg.scommesse;
    const newBets = [];
    for (let bi = 0; bi < bets.length; bi++) {
      const bet = bets[bi];
      // Deep copy bet
      newBets.push(this.deepCopyBet(bet));
    }
    // Deep copy bet group
    return {
      idAggregata: agg.idAggregata,
      descrizione: agg.descrizione,
      ranking: agg.ranking,
      isPrincipale: agg.isPrincipale,
      scommesse: newBets,
      compattate: agg.compattate,
      localeCmpDesc: agg.localeCmpDesc,
      sportId: agg.sportId,
    };
  }

  deepCopyAggs(aggsList: any) {
    let aggs: any;
    const keys = Object.keys(aggsList);
    let pi: any;
    let sportId: any;

    let i = keys.length % 8;

    while (i) {
      sportId = keys[pi++];
      aggs[sportId] = this.deepCopyBetGroup(aggsList[sportId]);
      i--;
    }

    i = Math.floor(keys.length / 8);

    // Process 8 per loop
    while (i) {
      sportId = keys[pi++];
      aggs[sportId] = this.deepCopyBetGroup(aggsList[sportId]);
      sportId = keys[pi++];
      aggs[sportId] = this.deepCopyBetGroup(aggsList[sportId]);
      sportId = keys[pi++];
      aggs[sportId] = this.deepCopyBetGroup(aggsList[sportId]);
      sportId = keys[pi++];
      aggs[sportId] = this.deepCopyBetGroup(aggsList[sportId]);
      sportId = keys[pi++];
      aggs[sportId] = this.deepCopyBetGroup(aggsList[sportId]);
      sportId = keys[pi++];
      aggs[sportId] = this.deepCopyBetGroup(aggsList[sportId]);
      sportId = keys[pi++];
      aggs[sportId] = this.deepCopyBetGroup(aggsList[sportId]);
      sportId = keys[pi++];
      aggs[sportId] = this.deepCopyBetGroup(aggsList[sportId]);
      i--;
    }

    return aggs;
  }

  deepCopySportAggs(aggregate: any) {
    let result: any;
    const keys = Object.keys(aggregate);
    let pi: any;
    let sportId: any;

    let i = keys.length % 8;

    while (i) {
      sportId = keys[pi++];
      result[sportId] = this.deepCopyAggs(aggregate[sportId]);
      i--;
    }

    i = Math.floor(keys.length / 8);

    // Process 8 per loop
    while (i) {
      sportId = keys[pi++];
      result[sportId] = this.deepCopyAggs(aggregate[sportId]);
      sportId = keys[pi++];
      result[sportId] = this.deepCopyAggs(aggregate[sportId]);
      sportId = keys[pi++];
      result[sportId] = this.deepCopyAggs(aggregate[sportId]);
      sportId = keys[pi++];
      result[sportId] = this.deepCopyAggs(aggregate[sportId]);
      sportId = keys[pi++];
      result[sportId] = this.deepCopyAggs(aggregate[sportId]);
      sportId = keys[pi++];
      result[sportId] = this.deepCopyAggs(aggregate[sportId]);
      sportId = keys[pi++];
      result[sportId] = this.deepCopyAggs(aggregate[sportId]);
      sportId = keys[pi++];
      result[sportId] = this.deepCopyAggs(aggregate[sportId]);
      i--;
    }

    return result;
  }

  getPrematchAggs(sportId: any, aggId: any) {
    const aggsList = data as any;
    if (sportId == null && aggId == null) {
      return this.deepCopySportAggs(data);
    } else if (aggId == null) {
      return this.deepCopyAggs(aggsList[sportId]);
    } else {
      const agg = aggsList[sportId][aggId];
      return agg != null ? this.deepCopyBetGroup(agg) : null;
    }
  }

  getLiveAggs(sportId: any, aggId: any) {
    const aggsList = liveData as any;
    if (sportId == null && aggId == null) {
      return this.deepCopySportAggs(aggsList);
    } else if (aggId == null) {
      return this.deepCopyAggs(aggsList[sportId]);
    } else {
      const agg = aggsList[sportId][aggId];
      return agg != null ? this.deepCopyBetGroup(agg) : null;
    }
  }

  getSplitDesc(desc: string) {
    if (typeof desc !== "string") {
      return ["", null];
    }
    const parts = desc.split(" - ");
    return [parts[0], parts[1] || null];
  }

  oddToString(odd: number) {
    if (odd > 100) {
      return parseFloat((odd / 100.0).toString()).toFixed(2);
    } else {
      return null;
    }
  }

  addOddsValuesToBet(
    matchData: { isLive: any; desc: any; uniqueId: any },
    betData: { eqs: any[]; dia: any; maxg: any; ming: any },
    bet: {
      odds: any[];
      aggDesc: any;
      aggId: number;
      calculateHandicapDescription: any;
      desc: any;
      handicap: any;
      hideHandicap: any;
      id: any;
      legabile: any;
      parametrica: any;
      tipoHandicap: number;
      forceOddsListColumn: boolean;
      hasOddTooltips: boolean;
    },
    odds: any[]
  ) {
    betData.eqs.forEach((e) => {
      e.d = e.dsl?.RO ?? null;
    });

    // MODELLI SCOMMESSA A LISTA (da Aggregata esiti � SEMPRE vuoto)
    if (bet.odds.length === 0) {
      const oddBetData = {
        aggDesc: bet.aggDesc,
        aggId: bet.aggId,
        calculateHandicapDescription: bet.calculateHandicapDescription,
        desc: bet.desc,
        dia: betData.dia,
        handicap: bet.handicap,
        hideHandicap: bet.hideHandicap,
        id: bet.id,
        isLive: matchData.isLive,
        legabile: bet.legabile,
        maxg: betData.maxg,
        ming: betData.ming,
        parametrica: bet.parametrica,
        tipoHandicap: bet.tipoHandicap,
      };
      const [team1, team2] = this.getSplitDesc(matchData.desc);

      bet.forceOddsListColumn = true;
      bet.hasOddTooltips = false;
      bet.odds = odds
        .filter((o) => o.q > 0)
        .sort((a, b) => a.q - b.q)
        .map((odd) => {
          if (!bet.hasOddTooltips && odd.tooltip?.length > 0) {
            bet.hasOddTooltips = true;
          }

          return {
            alias: "",
            betData: oddBetData,
            betId: bet.id,
            desc: odd.d,
            id: odd.ce,
            matchData,
            ranking: 0,
            rawValue: odd.q > 100 ? odd.q : null,
            team1,
            team2,
            uniqueId: `${matchData.uniqueId}_${bet.id}_${bet.handicap}_${odd.ce}`,
            value: this.oddToString(odd.q),
          };
        });

      return;
    }

    if (bet.tipoHandicap === 7) {
      const oddById = new Map();
      bet.odds.forEach((o) => oddById.set(o.id, o));

      betData.eqs.forEach((e) => {
        if (oddById.has(e.ce)) {
          oddById.get(e.ce).desc = e.d;
        }
      });
    }

    const oddBetData = {
      aggDesc: bet.aggDesc,
      aggId: bet.aggId,
      calculateHandicapDescription: bet.calculateHandicapDescription,
      desc: bet.tipoHandicap === 6 && bet.aggId > 0 ? bet.aggDesc : bet.desc,
      dia: betData.dia,
      eqs: betData.eqs,
      handicap: bet.handicap,
      hideHandicap: bet.hideHandicap,
      id: bet.id,
      isLive: matchData.isLive,
      legabile: bet.legabile,
      maxg: betData.maxg,
      ming: betData.ming,
      parametrica: bet.parametrica,
      tipoHandicap: bet.tipoHandicap,
    };
    const [team1, team2] = this.getSplitDesc(matchData.desc);

    const oddById = new Map();
    odds.forEach((odd) => oddById.set(odd.ce, odd));

    // Aggiungo i valori delle quote alla scommessa
    bet.hasOddTooltips = false;
    bet.odds = bet.odds.map((odd) => {
      if (!bet.hasOddTooltips && odd.tooltip?.length > 0) {
        bet.hasOddTooltips = true;
      }

      const value = oddById.get(odd.id)?.q ?? 0;
      return {
        ...odd,
        uniqueId: `${matchData.uniqueId}_${bet.id}_${bet.handicap}_${odd.id}`,
        rawValue: value > 100 ? value : null,
        value: this.oddToString(value),
        matchData,
        betData: oddBetData,
        team1,
        team2,
      };
    });
  }

  splitHandicap(
    handicap: any,
    handicapType: number,
    draws: string | any[] | null,
    additionalData: string | any[] | null,
    language: string | number
  ) {
    let handicapTradotto: any = {
      info1: null,
      info2: null,
      info3: null,
      info4: null,
      infoCalcolate: 0,
    };

    /* splitto l'handicap */
    if (
      handicapType === 1 ||
      handicapType === 2 ||
      handicapType === 3 ||
      handicapType === 4 ||
      handicapType === 5 ||
      handicapType === 21 ||
      handicapType === 22
    ) {
      handicapTradotto.info1 = handicap;
      handicapTradotto.infoCalcolate = 1;
    } else {
      const buffer = new ArrayBuffer(32);
      const view = new DataView(buffer);
      view.setInt32(0, handicap);

      if (
        handicapType === 6 ||
        handicapType === 23 ||
        handicapType === 24 ||
        handicapType === 25 ||
        handicapType === 26 ||
        handicapType === 27 ||
        handicapType === 32 ||
        handicapType === 33 ||
        handicapType === 46
      ) {
        const pos12 = view.getInt16(0) as any;
        const pos34 = view.getInt16(2) as any;

        handicapTradotto.info1 = pos34;
        handicapTradotto.info2 = pos12;
        handicapTradotto.infoCalcolate = 2;
      } else if (handicapType === 20) {
        const pos2 = view.getInt8(1);
        const pos3 = view.getInt8(2);
        const pos4 = view.getInt8(3);

        handicapTradotto.info1 = pos4 as any;
        handicapTradotto.info2 = pos3 as any;
        handicapTradotto.info3 = pos2 as any;
        handicapTradotto.infoCalcolate = 3;
      } else if (
        handicapType === 7 ||
        handicapType === 31 ||
        handicapType === 35 ||
        handicapType === 38 ||
        handicapType === 50
      ) {
        const pos12 = view.getInt16(0);
        const pos3 = view.getInt8(2);
        const pos4 = view.getInt8(3);

        handicapTradotto.info1 = pos4 as any;
        handicapTradotto.info2 = pos3 as any;
        handicapTradotto.info3 = pos12 as any;
        handicapTradotto.infoCalcolate = 3;
      } else if (handicapType === 28 || handicapType === 36) {
        const pos1 = view.getInt8(0);
        const pos2 = view.getInt8(1);
        const pos34 = view.getInt16(2);

        handicapTradotto.info1 = pos34 as any;
        handicapTradotto.info2 = pos2 as any;
        handicapTradotto.info3 = pos1 as any;
        handicapTradotto.infoCalcolate = 3;
      } else if (handicapType === 29) {
        const pos1 = view.getInt8(0);
        const pos23 = view.getInt16(1);
        const pos4 = view.getInt8(3);

        handicapTradotto.info1 = pos4 as any;
        handicapTradotto.info2 = pos23 as any;
        handicapTradotto.info3 = pos1 as any;
        handicapTradotto.infoCalcolate = 3;
      } else if (
        handicapType === 30 ||
        handicapType === 40 ||
        handicapType === 42
      ) {
        const pos1 = view.getInt8(0);
        const pos2 = view.getInt8(1);
        const pos3 = view.getInt8(2);
        const pos4 = view.getInt8(3);

        handicapTradotto.info1 = pos4 as any;
        handicapTradotto.info2 = pos3 as any;
        handicapTradotto.info3 = pos2 as any;
        handicapTradotto.info4 = pos1 as any;
        handicapTradotto.infoCalcolate = 4;
      }
    }

    // traduco l'handicap in base alla tipologia
    if (
      handicapType === 1 ||
      handicapType === 2 ||
      handicapType === 3 ||
      handicapType === 4
    ) {
      handicapTradotto.info1 = `${handicap / 100}` as any;
      handicapTradotto.infoCalcolate = 1;
    } else if (handicapType === 5 || handicapType === 6) {
      handicapTradotto.idAnagrafica = handicapTradotto.info1 as any;
      let descrizioneInfoAggiuntiva = handicap;
      if (additionalData) {
        if (additionalData.length > 0) {
          descrizioneInfoAggiuntiva = additionalData;
        }
      }
      handicapTradotto.info1 = descrizioneInfoAggiuntiva;
      handicapTradotto.infoCalcolate = 1;
    } else if (handicapType === 7) {
      handicapTradotto.idAnagrafica = handicapTradotto.info1;
      handicapTradotto.idAnagrafica2 = handicapTradotto.info2;
      let dia = null;
      if (additionalData) {
        if (additionalData.length > 0) {
          dia = additionalData;
        }
      }

      if (dia) {
        // print case or market not in (head to head, 1x2) types
        handicapTradotto.info1 = dia;
        handicapTradotto.info2 = null;
        handicapTradotto.info3 = null;
        handicapTradotto.info4 = null;
        handicapTradotto.infoCalcolate = 1;
      } else if (draws != null) {
        let descDraw = "";
        for (let i = 0; i < draws.length; i++) {
          let draw = draws[i];
          if (draw.dsl) {
            descDraw += draw.dsl[language];
          } else if (draw.d) {
            descDraw += draw.d;
          }
          if (i < draws.length - 1) {
            descDraw += " - ";
          }
        }
        handicapTradotto.info1 = descDraw;
        handicapTradotto.info2 = null;
        handicapTradotto.info3 = null;
        handicapTradotto.info4 = null;
        handicapTradotto.infoCalcolate = 1;
      }
    } else if (handicapType === 26) {
      handicapTradotto.info1 = `${handicapTradotto.info1 / 10}`;
      handicapTradotto.info2 = `${handicapTradotto.info2 / 10}`;
    } else if (
      handicapType === 23 ||
      handicapType === 28 ||
      handicapType === 29 ||
      handicapType === 30 ||
      handicapType === 33
    ) {
      handicapTradotto.info1 = `${handicapTradotto.info1 / 10}`;
    } else if (handicapType === 35 || handicapType === 38) {
      let h1 = handicapTradotto.info3;
      let h2 = "Player " + handicapTradotto.info1;
      handicapTradotto.idAnagrafica = handicapTradotto.info1;
      if (handicapType === 35) {
        h1 = `${h1 / 10}`;
      }
      if (additionalData != null) {
        h2 = additionalData as any;
      }
      handicapTradotto.info1 = h2;
      handicapTradotto.info2 = h1;
      handicapTradotto.infoCalcolate = 2;
    } else if (handicapType === 46 && additionalData) {
      handicapTradotto.info2 = additionalData;
    }

    return handicapTradotto;
  }

  parseHandicap(
    desc: string,
    handicap: number,
    tipoHandicap: number,
    draws: any,
    additionalData: any,
    handleAsianHandicap = false
  ) {
    const result = this.splitHandicap(
      handicap,
      tipoHandicap,
      draws,
      additionalData,
      "RO"
    );
    if (tipoHandicap === 23 && handleAsianHandicap) {
      if (result.info1[0] === "-") {
        result.info1 = result.info1.slice(1);
      } else {
        result.info1 = `-${result.info1}`;
      }
    }
    let toAppend = "";
    if (desc.includes("@@")) {
      if (handicap === 0) {
        desc = desc
          .replace("@@H1@@", "X")
          .replace("@@H2@@", "Y")
          .replace("@@H3@@", "Z")
          .replace("@@H4@@", "K");
      } else {
        desc = desc
          .replace("@@H1@@", result.info1)
          .replace("@@H2@@", result.info2)
          .replace("@@H3@@", result.info3)
          .replace("@@H4@@", result.info4);

        if (tipoHandicap === 38 && !desc.includes(result.info2)) {
          desc += " " + result.info2;
        }
      }
    } else if (desc.includes("{{")) {
      desc = desc
        .replace("{{H1}}", result.info1)
        .replace("{{H2}}", result.info2)
        .replace("{{H3}}", result.info3)
        .replace("{{H4}}", result.info4);
    } else if (desc.indexOf(":") === -1) {
      for (let i = 0; i < result.infoCalcolate; i++) {
        const res = result[`info${i + 1}`];
        toAppend += `${i > 0 ? " " : ""}${res.dia ? res.dia : res}`;
      }
    }

    if (desc === "") {
      return toAppend;
    } else {
      return `${desc} ${toAppend}`;
    }
  }

  byRanking(a: { ranking: number }, b: { ranking: number }) {
    return a.ranking - b.ranking;
  }

  compactBets(
    bets: any[],
    agg: {
      compattate: { [x: string]: any };
      idAggregata: any;
      localeCmpDesc: { [x: string]: { [x: string]: string } };
    },
    compattaParametriche = false
  ) {
    if (agg.compattate) {
      const betsByUniqueId = new Map();

      bets.forEach((bet) => {
        if (bet.parametrica && !compattaParametriche) {
          return;
        }
        const uniqueId = `${bet.id}_${bet.handicap}`;
        if (!betsByUniqueId.has(uniqueId)) {
          betsByUniqueId.set(uniqueId, [bet]);
        } else {
          betsByUniqueId.get(uniqueId).push(bet);
        }

        if (bet.handicap !== 0) {
          const uniqueId = `${bet.id}_0`;
          if (!betsByUniqueId.has(uniqueId)) {
            betsByUniqueId.set(uniqueId, [bet]);
          } else {
            betsByUniqueId.get(uniqueId).push(bet);
          }
        }
      });

      const compactedBets: any = [];
      Object.keys(agg.compattate).forEach((desc, i) => {
        const cmpIds = agg.compattate[desc];
        let cmpBet:
          | { odds: string | any[]; nOdds: any; hasOdds: boolean }
          | any = null;

        let betsToCompact: any[] = [];
        cmpIds.forEach((cmpId: any) => {
          if (betsByUniqueId.has(cmpId)) {
            betsToCompact.push(...betsByUniqueId.get(cmpId));
          }
        });

        let hasOdds = false;
        betsToCompact.sort(this.byRanking).forEach((b) => {
          if (cmpBet == null) {
            const bet = betsToCompact[0];

            const betId = `cmp_${agg.idAggregata}_${i + 1}`;
            desc = agg.localeCmpDesc?.[desc]?.["RO"] ?? desc;
            cmpBet = {
              ...bet,
              id: betId,
              calculateHandicapDescription: false,
              compactView: bet.parametrica,
              desc,
              isCompact: true,
              odds: [],
              uniqueId: betId,
            };
          }
          if (!hasOdds && b.hasOdds === true) {
            hasOdds = true;
          }
          b.skip = true;
          cmpBet.odds = cmpBet.odds.concat(b.odds);
        });

        if (cmpBet != null && cmpBet.odds.length > 0) {
          cmpBet.nOdds = cmpBet.odds.length;
          cmpBet.hasOdds = hasOdds;
          compactedBets.push(cmpBet);
        }
      });

      bets = bets.filter((b) => b.skip == null).concat(compactedBets);
    }

    return bets;
  }

  parseBetsData(
    matchData: matchData,
    aggregate: number[],
    idAggregata: number,
    bets: bet[],
    isLive: boolean
  ) {
    const sportId = matchData.sportRef;
    const betsById = new Map(),
      gruppiScommessa: any[] = [];
    let gruppoById: any = {};
    let aggregata: any = null;
    aggregate.forEach((ag) => {
      const agData = isLive
        ? this.getLiveAggs(sportId, ag)
        : this.getPrematchAggs(sportId, ag);
      if (agData != null) {
        if (ag === idAggregata) {
          aggregata = gruppoById[ag] = agData;
          gruppiScommessa.push(aggregata);
        } else {
          gruppiScommessa.push((gruppoById[ag] = agData));
        }
      }
    });

    gruppiScommessa.sort((a, b) => {
      if (a.idAggregata < 0) {
        return -1;
      } else if (b.idAggregata < 0) {
        return 1;
      }
      return a.ranking - b.ranking;
    });

    if (aggregata == null) {
      return {
        betsById,
        gruppoById,
        gruppiScommessa,
      };
    }

    let aggsToProcess = [];
    if (idAggregata < 0) {
      aggsToProcess = gruppiScommessa.filter((agg) => agg.idAggregata > 0);

      // Assegna il ranking delle scommesse in base al ranking aggregata
      let rankingOffset = 0;
      gruppiScommessa.forEach((ag) => {
        ag.scommesse.forEach(
          (s: { ranking: number; belongsMainGroup: any }) => {
            s.ranking = s.ranking + rankingOffset;
            s.belongsMainGroup = ag.isPrincipale;
          }
        );
        rankingOffset += ag.scommesse.length;
      });

      const unmappedMap = new Map();
      if (unmappedMap.size > 0) {
        const unmappedBets: any[] = [];
        let rankingFake = 10000;
        bets.forEach((bet) => {
          const id = `${sportId}_${isLive ? "lv" : "pr"}_${bet.cs}_${0}`;
          if (unmappedMap.has(id)) {
            const bet = this.deepCopyBet(unmappedMap.get(id));
            bet.ranking = rankingFake += 1;
            unmappedBets.push(bet);
          }
        });

        aggsToProcess.push({
          id: idAggregata,
          scommesse: unmappedBets,
        });
      }
    } else {
      aggsToProcess.push(aggregata);
    }

    const parsedBets: { id: any; handicap: any }[] = [];
    const parsedBetsSet = new Set();
    function pushBet(bet: { id: any; handicap: any }) {
      const uniqueId = `${bet.id}_${bet.handicap}`;
      if (!parsedBetsSet.has(uniqueId)) {
        parsedBetsSet.add(uniqueId);
        parsedBets.push(bet);
      }
    }

    aggsToProcess.forEach((agg) => {
      const aggBets = agg.scommesse;
      let parsedAggBets: any[] = [];

      const betDataByUniqueId = new Map();
      const betsWithHandicapById = new Map();
      const betsWithoutOdds = new Set();
      bets.forEach((bet) => {
        if (!betsWithHandicapById.has(bet.cs)) {
          betsWithHandicapById.set(bet.cs, [bet]);
        } else {
          betsWithHandicapById.get(bet.cs).push(bet);
        }
        let uniqueId = `${bet.cs}_${bet.h}`;
        betDataByUniqueId.set(uniqueId, bet);
      });

      aggBets.forEach(
        (bet: {
          id: unknown;
          handicap: any;
          eqs: any;
          odds: any[];
          h: any;
          cs: any;
        }) => {
          const uniqueId = `${bet.id}_${bet.handicap}`;
          bet.eqs = bet.odds.map((o) => {
            return {
              ce: o.id,
              q: o.value,
              d: o.desc,
            };
          });
          bet.h = bet.handicap;
          bet.cs = bet.id;
          if (!betsWithHandicapById.has(bet.id)) {
            // Se non presente tra le quotate, la aggiungo
            betsWithHandicapById.set(bet.id, [bet]);
            betsWithoutOdds.add(bet.id);
          }
          if (!betDataByUniqueId.has(uniqueId)) {
            // Se non presente tra le quotate, la aggiungo
            betDataByUniqueId.set(uniqueId, bet);
            betsWithoutOdds.add(uniqueId);
          }
        }
      );

      const normal: any[] = [];
      const withHandicap: any[] = [];
      aggBets.forEach(
        (bet: {
          id: unknown;
          handicap: any;
          parametrica: any;
          hasOdds: boolean;
        }) => {
          const uniqueId = `${bet.id}_${bet.handicap}`;
          if (
            (bet.parametrica && betsWithoutOdds.has(bet.id)) ||
            (!bet.parametrica && betsWithoutOdds.has(uniqueId))
          ) {
            bet.hasOdds = false;
          } else {
            bet.hasOdds = true;
          }
          if (bet.parametrica) {
            withHandicap.push(bet);
          } else {
            normal.push(bet);
          }
        }
      );

      normal.forEach((bet) => {
        const updatedBet = {
          ...bet,
          uniqueId: `${matchData.uniqueId}_${bet.id}_${bet.handicap}`,
        };

        // Se l'aggregata esiste tra quelle del torneo, aggiungi quote e handicap
        const uniqueId = `${updatedBet.id}_${updatedBet.handicap}`;
        if (betDataByUniqueId.has(uniqueId)) {
          const betData = betDataByUniqueId.get(uniqueId);
          updatedBet.handicap = betData.h;
          this.addOddsValuesToBet(matchData, betData, updatedBet, betData.eqs);
        }

        parsedAggBets.push(updatedBet);
      });

      withHandicap.forEach((parametrica) => {
        // Se l'aggregata esiste tra quelle del torneo, aggiungi quote e handicap
        if (betsWithHandicapById.has(parametrica.id)) {
          const bets = betsWithHandicapById.get(parametrica.id);
          bets.forEach((bet: bet) => {
            const updatedBet = {
              ...parametrica,
              //desc: parametrica.tipoHandicap === 6 ? parametrica.aggDesc : parametrica.desc,
              desc:
                parametrica.tipoHandicap === 6
                  ? parametrica.aggDesc
                  : this.parseHandicap(
                      parametrica.desc,
                      bet.h,
                      parametrica.tipoHandicap,
                      bet.eqs,
                      bet.dia
                    ),
              descNoHandicap: parametrica.desc,
              uniqueId: `${matchData.uniqueId}_${bet.cs}_${bet.h}`,
              handicap: bet.h,
              handicapDesc: this.parseHandicap(
                "",
                bet.h,
                parametrica.tipoHandicap,
                bet.eqs,
                bet.dia
              ),
              dia: bet.dia,
            };
            // @ts-ignore
            this.addOddsValuesToBet(matchData, bet, updatedBet, bet.eqs);

            if (ASIAN_HANDICAP.includes(updatedBet.id)) {
              updatedBet.odds.forEach((odd: { desc: string }, i: number) => {
                let hcp = updatedBet.handicap;
                let handleAsianHandicap = false;
                if (i === 1) {
                  if (parametrica.tipoHandicap !== 23) {
                    hcp *= -1;
                  }
                  handleAsianHandicap = true;
                }
                const handicapDesc = this.parseHandicap(
                  "",
                  hcp,
                  parametrica.tipoHandicap,
                  bet.eqs,
                  bet.dia,
                  handleAsianHandicap
                );
                odd.desc = `${odd.desc} (${handicapDesc})`;
                console.log(odd.desc);
              });
            }
            parsedAggBets.push(updatedBet);
          });
        }
      });

      parsedAggBets = this.compactBets(parsedAggBets, agg, false);

      parsedAggBets.forEach((bet) => pushBet(bet));
    });

    parsedBets.forEach((bet) => {
      // @ts-ignore
      if (bet.parametrica) {
        // Ordina esiti parametrica per handicap
        // @ts-ignore
        bet.odds.sort(
          (odd1: { handicap: number }, odd2: { handicap: number }) => {
            return odd1.handicap - odd2.handicap;
          }
        );

        if (!betsById.has(bet.id)) {
          betsById.set(bet.id, []);
        }

        const betsList = betsById.get(bet.id);
        const el = betsList.find(
          (b: { handicap: any }) => b.handicap === bet.handicap
        );
        if (el === undefined) {
          betsList.push(bet);
        }
      }
    });

    // Ordina le parametriche per handicap
    betsById.forEach((bets) => {
      if (bets.length > 1 && bets[0].odds.length === 2) {
        bets.forEach((bet: { odds: any; diff: number }) => {
          const odds = bet.odds;
          bet.diff = Math.abs(odds[0].rawValue - odds[1].rawValue);
        });
        bets = bets.sort(
          (b1: { diff: number }, b2: { diff: number }) => b1.diff - b2.diff
        );
      } else if (bets.length > 1) {
        bets = bets.sort(
          (
            a: { tipoHandicap: any; handicapDesc: string; handicap: number },
            b: { tipoHandicap: any; handicapDesc: any; handicap: number }
          ) => {
            if (
              a.tipoHandicap === b.tipoHandicap &&
              HANDICAP_TYPES_TO_SORT_BY_DESC.includes(a.tipoHandicap)
            ) {
              return a.handicapDesc.localeCompare(b.handicapDesc);
            } else {
              return a.handicap - b.handicap;
            }
          }
        );
      }
    });

    // Ordina le scommesse per ranking
    // A parità di ranking ordinale per handicap
    aggregata.scommesse = parsedBets.sort((a, b) => {
      // @ts-ignore
      if (a.ranking === b.ranking) {
        return a.handicap - b.handicap;
      } else {
        // @ts-ignore
        return a.ranking - b.ranking;
      }
    });

    return {
      bets: parsedBets,
      betsById,
      gruppoById,
      gruppiScommessa,
    };
  }

  parseTournamentEvents(
    tournament: tournament,
    aggregate: number[],
    idAggregata: number,
    isLive: boolean
  ) {
    const matchData = {
      sportRef: tournament.is,
      tournamentRef: tournament.it,
      pal: tournament.p,
      avv: tournament.a,
      id: tournament.bid,
      desc: tournament.dsl.RO,
      uniqueId: 0,
      alias: tournament.al,
      timestamp: tournament.ts,
      isLive: false,
    };

    const betsData = this.parseBetsData(
      matchData,
      aggregate,
      idAggregata,
      tournament.scs,
      isLive
    );
    const [team1, team2] = this.getSplitDesc(matchData.desc);
    const dateShort = `${tournament.ts.slice(6, 8)}.${tournament.ts.slice(
      4,
      6
    )}`;
    const dateShortYear = `${dateShort}.${tournament.ts.slice(0, 4)}`;

    const match = {
      ...betsData,
      alias: tournament.al,
      avv: tournament.a,
      competitorIdAway: tournament.cida,
      competitorIdHome: tournament.cidh,
      //date: formatDateWithWeekDay(m.ts).dayMonthYear,
      dateShort,
      dateShortYear,
      desc: matchData.desc,
      favorite: false,
      geniusId: tournament.gid,
      id: tournament.bid,
      isLive: tournament.lv,
      //jerseys: parseJerseys(m.j, tournament.sportRef),
      openAggregata: tournament.oa,
      openMacrogruppo: tournament.om,
      pal: tournament.p,
      plus: tournament.pl,
      round: tournament.r,
      team1,
      team2,
      //time: formatDate(m.ts).time,
      timestampDB: tournament.ts,
    };
    Object.assign(match, betsData);

    return match;
  }

  async processData(
    tournament: tournament,
    aggregate: number[],
    idAggregata: number,
    isLive: boolean
  ) {
    const betInfo = await this.fetchBets(
      tournament.p.toString(),
      tournament.a.toString(),
      (-tournament.is).toString()
    );
    const betLabels = this.parseTournamentEvents(
      tournament,
      aggregate,
      tournament.oa,
      false
    );

    betLabels.gruppiScommessa.forEach((scomessa) => {
      scomessa.scommesse.forEach((scom: scommesse, index: number) => {
        let found = betInfo.scs.filter((el) => {
          if (scom.handicap < 5000 && scom.handicap != 0) {
            if (scom.handicap == el.h && el.cs == scom.id) {
              return true;
            }
          } else if (el.cs == scom.id) {
            return true;
          }
        });

        if (found.length > 0) {
          scom.odds.map((od) => {
            try {
              od.value = found[found.length == 1 ? 0 : index].eqs[od.id - 1].q;
            } catch {
              od.value = found[index + 1 - scom.ranking].eqs[od.id - 1].q;
            }
          });
        }
      });
    });

    return betLabels;
  }

  async start() {
    const categories = await this.fetchCategories();
    let finalOdds: any[] = []; // make type
    const promises: Promise<basicInfo>[] = [];

    let allTournamentsMatches: basicInfo[] = [];
    categories.sps.forEach((category) => {
      if (
        category.dsl.EN == "Soccer" ||
        category.dsl.EN == "Tennis" ||
        category.dsl.EN == "Basketball" ||
        category.dsl.EN == "Baseball" ||
        category.dsl.EN == "Handball"
      ) {
        category.cts.forEach((competition) => {
          competition.tns.forEach((match) => {
            promises.push(
              this.fetchDailyEvents(
                category.id.toString(),
                competition.id.toString(),
                match.id.toString(),
                match.ags.length == 1
                  ? match.ags[0].toString()
                  : match.ba.toString()
              )
            );
          });
        });
      }
    });

    await Promise.all(promises).then((results) => {
      allTournamentsMatches = results;
    });
    let matches: Promise<any>[] = [];
    allTournamentsMatches.forEach((tournament) => {
      tournament.avs.forEach((matchData) => {
        matches.push(
          this.processData(matchData, tournament.ags, matchData.is, false)
        );
      });
    });

    await Promise.all(matches).then((results) => {
      finalOdds = results;
    });

    return finalOdds;
  }
}
