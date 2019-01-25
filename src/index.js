import "./index.css";

import initMessageForm from './modules/message-form/message-form';
import {initMessageList} from "./modules/message-list/message-list";
import {initPushMessage} from "./modules/push-message/push-message";
import {initMessageEvents} from './modules/message-events/message-events';
import {initAddToHomescreen} from './modules/add-to-homescreen/add-to-homescreen';

initMessageList();
initMessageForm();
initPushMessage();
initMessageEvents();
initAddToHomescreen();
