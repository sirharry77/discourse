import RestModel from "discourse/models/rest";
import { tracked } from "@glimmer/tracking";

function coreComponentForType() {
  return {
    bookmark_reminder: "user-menu/bookmark-reminder-notification-item",
    custom: "user-menu/custom-notification-item",
    granted_badge: "user-menu/granted-badge-notification-item",
    group_mentioned: "user-menu/group-mentioned-notification-item",
    group_message_summary: "user-menu/group-message-summary-notification-item",
    invitee_accepted: "user-menu/invitee-accepted-notification-item",
    liked: "user-menu/liked-notification-item",
    liked_consolidated: "user-menu/liked-consolidated-notification-item",
    membership_request_accepted:
      "user-menu/membership-request-accepted-notification-item",
    membership_request_consolidated:
      "user-menu/membership-request-consolidated-notification-item",
    watching_first_post: "user-menu/watching-first-post-notification-item",
  };
}

const DefaultItem = "user-menu/notification-item";
let _componentForType = coreComponentForType();

export function registerComponentForType(notificationType, component) {
  _componentForType[notificationType] = component;
}

export function resetCustomComponents() {
  _componentForType = coreComponentForType();
}

export default class Notification extends RestModel {
  @tracked read;

  get userMenuComponent() {
    const component =
      _componentForType[this.site.notificationLookup[this.notification_type]];
    return component || DefaultItem;
  }
}
