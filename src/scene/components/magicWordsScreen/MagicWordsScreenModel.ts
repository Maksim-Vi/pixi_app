import {Model} from "../../../core/mvc/Model";

export interface DialogueEntry {
    name: string;
    text: string;
}

export interface EmojiItem {
    name: string;
    url: string;
}

export type AvatarPosition = 'left' | 'right' | 'center';

export interface AvatarItem {
    name: string;
    url: string;
    position?: AvatarPosition;
}

export interface ConversationPayload {
    dialogue: DialogueEntry[];
    emojies: EmojiItem[];
    avatars: AvatarItem[];
}

export default class MagicWordsScreenModel extends Model{
    public dialogueData: ConversationPayload;
}