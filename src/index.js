import "./index.css";

import initMessageForm from './modules/message-form/message-form';
import {initMessageList} from "./modules/message-list/message-list";
import {initPushMessage} from "./modules/push-message/push-message";
import {initMessageEvents} from './modules/message-events/message-events';

initMessageList();
initMessageForm();
initPushMessage();
initMessageEvents();
