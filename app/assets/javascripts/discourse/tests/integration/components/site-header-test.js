import componentTest, {
  setupRenderingTest,
} from "discourse/tests/helpers/component-test";
import {
  count,
  discourseModule,
  exists,
  query,
} from "discourse/tests/helpers/qunit-helpers";
import pretender from "discourse/tests/helpers/create-pretender";
import hbs from "htmlbars-inline-precompile";
import { click, settled } from "@ember/test-helpers";

discourseModule("Integration | Component | site-header", function (hooks) {
  setupRenderingTest(hooks);

  componentTest("first notification mask", {
    template: hbs`{{site-header}}`,

    beforeEach() {
      this.set("currentUser.unread_high_priority_notifications", 1);
      this.set("currentUser.read_first_notification", false);
    },

    async test(assert) {
      assert.strictEqual(
        count(".ring-backdrop"),
        1,
        "there is the first notification mask"
      );

      // Click anywhere
      await click("header.d-header");

      assert.ok(
        !exists(".ring-backdrop"),
        "it hides the first notification mask"
      );
    },
  });

  componentTest("do not call authenticated endpoints as anonymous", {
    template: hbs`{{site-header}}`,
    anonymous: true,

    async test(assert) {
      assert.ok(
        !exists(".ring-backdrop"),
        "there is no first notification mask for anonymous users"
      );

      pretender.get("/notifications", () => {
        assert.ok(false, "it should not try to refresh notifications");
        return [403, { "Content-Type": "application/json" }, {}];
      });

      // Click anywhere
      await click("header.d-header");
    },
  });

  componentTest(
    "rerenders when all_unread_notifications or unseen_reviewable_count change",
    {
      template: hbs`{{site-header}}`,

      beforeEach() {
        this.siteSettings.enable_revamped_user_menu = true;
        this.currentUser.set("all_unread_notifications", 1);
      },

      async test(assert) {
        let unreadBadge = query(
          ".header-dropdown-toggle .unread-notifications"
        );
        assert.strictEqual(unreadBadge.textContent, "1");

        this.currentUser.set("all_unread_notifications", 5);
        await settled();

        unreadBadge = query(".header-dropdown-toggle .unread-notifications");
        assert.strictEqual(unreadBadge.textContent, "5");

        this.currentUser.set("unseen_reviewable_count", 3);
        await settled();

        unreadBadge = query(".header-dropdown-toggle .unread-notifications");
        assert.strictEqual(unreadBadge.textContent, "8");
      },
    }
  );
});
