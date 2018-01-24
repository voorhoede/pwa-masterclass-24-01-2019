import "./index.css";

import initMessageForm from './modules/message-form/message-form';
import {initMessageList} from "./modules/message-list/message-list";
import {initMessageEvents} from './modules/message-events/message-events';

initMessageList();
initMessageForm();
initMessageEvents();
