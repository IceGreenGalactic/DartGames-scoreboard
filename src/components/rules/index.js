import { GameRules501 } from "./GameRules501";
import { GameRulesClock } from "./GameRulesClock";
import { GameRulesKiller } from "./GameRulesKiller";

export const rulesByGame = {
  501: GameRules501,
  clock: GameRulesClock,
  killer: GameRulesKiller,
};
