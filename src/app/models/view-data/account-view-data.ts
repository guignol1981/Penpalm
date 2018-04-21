import {ViewOptionGroup} from '../options/view-option-group';
import {ViewOption} from '../options/view-option';
import {SingleInput} from '../single-input/single-input';
import {ViewAction} from '../actions/view-action';
import {EViewAction} from '../actions/e-view-action.enum';
import {AccountComponent} from '../../components/account/account.component';

export class AccountViewData {

    constructor() {
    }

    public static getOptions(accountComponent: AccountComponent): ViewOptionGroup[] {
        return [
            new ViewOptionGroup(
                'Options',
                [
                    new ViewOption('Logout', () => {
                        accountComponent.logout();
                    }),
                    new ViewOption('Close account', () => {
                        accountComponent.deleteAccount();
                    }, true, false, null, 'Click again to close account')
                ]
            )
        ];
    }

    public static getInputs(accountComponent: AccountComponent): SingleInput[] {
        return [];
    }

    public static getActions(accountComponent: AccountComponent): ViewAction[] {
        return [
            new ViewAction(
                'Save',
                () => {
                    accountComponent.save();
                },
                EViewAction.Primary
            )
        ];
    }
}
