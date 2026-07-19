// @ts-check
/// <reference path="../typings/noname-skill.d.ts" />
/** @type {Skill} */
const test_skill = {
    audio: 2,
    trigger: { player: "damageEnd" },
    filter(event, player) {
        // GameEvent player access
        return event.player.isIn() && event.player !== player && player.isDamaged();
    },
    getIndex(event, player, triggername) {
        return event.num;
    },
    async content(event, trigger, player) {
        // Basic operations
        await player.draw(2);
        await player.draw({ num: 2 });
        await player.discard(player.getCards("h"));
        await player.gain(trigger.cards || [], player);

        // Player state checks
        const isMinHp = player.isMinHp();
        const isMaxHand = player.isMaxHandcard();
        const hp = player.getHp();
        const damagedHp = player.getDamagedHp();

        // Storage
        player.setStorage("test", 1, true);
        const storage = player.getStorage("test", 0);
        if (player.hasStorage("test", 1)) {
            player.updateStorage("test", v => v + 1);
        }

        // Equipment/judge
        const hasEquip = player.hasEquip("equip1");
        const emptySlot = player.hasEmptySlot(1);
        const enabled = player.hasEnabledSlot("equip1");
        const equip = player.getEquip("equip1");
        const equips = player.getEquips();
        const hasJudge = player.hasJudge("lebu");

        // Choose methods with string position
        await player.chooseToDiscard("he");
        await player.chooseToDiscard(2);
        await player.chooseToDiscard("he", 2);
        await player.chooseToDiscard({ position: "he", forced: true });
        await player.chooseToGive({ target: game.players[0], position: "h" });
        await player.chooseToGuanxing(5);
        await player.chooseToCompare(game.players[0]);

        // Others
        await player.recast(player.getCards("h"));
        await player.executeDelayCardEffect("shandian");
        player.addGaintag(player.getCards("h"), "test_tag");
        const exp = player.getExpansions("test_tag");

        // Global objects
        game.log("test");
        game.delay(1);
        game.broadcastAll(() => {});
        const hasFriend = game.hasPlayer(p => p !== player && get.attitude(player, p) > 0);
        const mode = get.mode();
        const type = get.type(trigger.card);
        const suit = get.suit(trigger.card);
        const name = get.name(trigger.card);
        const isPlayer = get.is.player(trigger.player);
        const isCard = get.is.card(trigger.card);

        // Card methods
        if (trigger.card && trigger.card.hasGaintag("test_tag")) {
            trigger.card.addNature("fire");
        }

        // Library
        const skill = lib.skill["test"];
        const filter = lib.filter.notMe;
        const translation = lib.translate["test"];
    },
};

export default test_skill;
