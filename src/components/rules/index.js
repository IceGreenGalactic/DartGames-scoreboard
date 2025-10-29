import { GameRules501 } from "./GameRules501";
import { GameRules301 } from "./GameRules301";
import { GameRulesClock } from "./GameRulesClock";
import { GameRulesKiller } from "./GameRulesKiller";

export const rulesByGame = {
  501: GameRules501,
  301: GameRules301,
  clock: GameRulesClock,
  killer: GameRulesKiller,
};
