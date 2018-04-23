import {ComposeComponent} from '../../components/compose/compose.component';
import {ViewOptionGroup} from '../options/view-option-group';
import {ViewOption} from '../options/view-option';
import {EBackSideOption} from '../postcard/postcard';
import {SingleInput} from '../single-input/single-input';
import {ESingleInput} from '../single-input/e-single-input.enum';
import {ViewAction} from '../actions/view-action';
import {EViewAction} from '../actions/e-view-action.enum';
import {InboxComponent} from '../../components/inbox/inbox.component';

export class InboxViewData {

    public static getOptions(inboxComponent: InboxComponent): ViewOptionGroup[] {
        return [];
    }

    public static getActions(inboxComponent: InboxComponent): ViewAction[] {
        return [
            new ViewAction(
                'Flip',
                () => {
                    inboxComponent.flipPostcard();
                },
                EViewAction.Secondary,
                false,
                () => {
                    return !!inboxComponent.activePostcard;
                }
            )
        ];
    }

    public static getInputs(inboxComponent: InboxComponent): SingleInput[] {
        return [];
    }

}
