import {ComposeComponent} from '../../components/compose/compose.component';
import {ViewOptionGroup} from '../options/view-option-group';
import {ViewOption} from '../options/view-option';
import {EBackSideOption} from '../postcard/postcard';
import {SingleInput} from '../single-input/single-input';
import {ESingleInput} from '../single-input/e-single-input.enum';
import {ViewAction} from '../actions/view-action';
import {EViewAction} from '../actions/e-view-action.enum';
import {MatcherComponent} from '../../components/matcher/matcher.component';

export class MatcherViewData {

    constructor() {
    }

    public static getOptions(matcherComponent: MatcherComponent): ViewOptionGroup[] {
        return [
            new ViewOptionGroup(
                'Pen pals',
                [
                    new ViewOption('Discover', () => {
                        matcherComponent.viewList('discover');
                    }, false, true),
                    new ViewOption('My pals', () => {
                        matcherComponent.viewList('pals');
                    }, false, true),
                    new ViewOption('Pending requests', () => {
                        matcherComponent.viewList('pending-requests');
                    }, false, true),
                    new ViewOption('Sent requests', () => {
                        matcherComponent.viewList('sent-requests');
                    }, false, true)
                ]
            ),
            new ViewOptionGroup(
                'Options',
                [
                    new ViewOption('Remove pal', () => {
                        matcherComponent.removePal();
                    }, true, false, () => {
                        return matcherComponent.user.isPal(matcherComponent.selectedUser._id);
                    }, 'Click again to remove pal'),
                    new ViewOption('Accept request', () => {
                        matcherComponent.handleRequest(true);
                    }, false, false, () => {
                        return matcherComponent.user.hasRequestFrom(matcherComponent.selectedUser._id) &&
                            !matcherComponent.user.isPal(matcherComponent.selectedUser._id);
                    }),
                    new ViewOption('Refuse request', () => {
                        matcherComponent.handleRequest(false);
                    }, false, false, () => {
                        return matcherComponent.user.hasRequestFrom(matcherComponent.selectedUser._id) &&
                            !matcherComponent.user.isPal(matcherComponent.selectedUser._id);
                    }),
                    new ViewOption('Cancel request', () => {
                        matcherComponent.cancelRequest();
                    }, false, false, () => {
                        return matcherComponent.selectedUser.hasRequestFrom(matcherComponent.user._id) &&
                            !matcherComponent.user.isPal(matcherComponent.selectedUser._id);
                    }),
                    new ViewOption('Send request', () => {
                        matcherComponent.sendRequest();
                    }, false, false, () => {
                        return !matcherComponent.user.hasRequestFrom(matcherComponent.selectedUser._id) &&
                            !matcherComponent.user.isPal(matcherComponent.selectedUser._id) &&
                            !matcherComponent.selectedUser.hasRequestFrom(matcherComponent.user._id);
                    })
                ],
                () => {
                    return matcherComponent.selectedUser !== null;
                }
            ),
            new ViewOptionGroup(
                'Filters',
                [
                    new ViewOption('Country', () => {
                        matcherComponent.filterDisplayed = 'country';
                    }, false, false, () => {
                        return matcherComponent.findFilter.country === 'none';
                    }),
                    new ViewOption('Remove country filter', () => {
                        matcherComponent.filterDisplayed = 'none';
                        matcherComponent.setCountryFilter('none');
                    }, false, false, () => {
                        return matcherComponent.findFilter.country !== 'none';
                    }),
                    new ViewOption('Language', () => {
                        matcherComponent.filterDisplayed = 'language';
                    }, false, false, () => {
                        return matcherComponent.findFilter.language === 'none';
                    }),
                    new ViewOption('Remove language filter', () => {
                        matcherComponent.filterDisplayed = 'none';
                        matcherComponent.setLanguageFilter('none');
                    }, false, false, () => {
                        return matcherComponent.findFilter.language !== 'none';
                    })
                ],
                () => {
                    return matcherComponent.view === 'discover';
                }
            )
        ];
    }

    public static getInputs(matcherComponent: MatcherComponent): SingleInput[] {
        return [
            new SingleInput(
                'Country filter',
                ESingleInput.DropDown,
                (singleInput: SingleInput) => {
                    matcherComponent.setCountryFilter(singleInput.value);
                },
                () => {
                    return matcherComponent.filterDisplayed === 'country' && matcherComponent.countryList;
                },
                null,
                matcherComponent.countryList.map(a => a = {
                    label: a,
                    value: a
                })
            ),
            new SingleInput(
                'Language filter',
                ESingleInput.DropDown,
                (singleInput: SingleInput) => {
                    matcherComponent.setLanguageFilter(singleInput.value);
                },
                () => {
                    return matcherComponent.filterDisplayed === 'language' && matcherComponent.languageList;
                },
                null,
                matcherComponent.languageList.map(a => a = {
                    label: a,
                    value: a
                })
            )
        ];
    }

    public static getActions(matcherComponent: MatcherComponent): ViewAction[] {
        return [
            new ViewAction(
                'Show more',
                () => {
                    matcherComponent.find();
                },
                EViewAction.Primary,
                false,
                () => {
                    return matcherComponent.view === 'discover';
                }
            ),
            new ViewAction(
                'Back',
                () => {
                    matcherComponent.view = 'discover';
                },
                EViewAction.Primary,
                false,
                () => {
                    matcherComponent.selectedUser = null;
                    return matcherComponent.view === 'details';
                }
            )
        ];
    }
}
