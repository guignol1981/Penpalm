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
                    }, false, true, null, null, null, null, true),
                    new ViewOption('My pals (' + matcherComponent.user.pals.length + ')', () => {
                        matcherComponent.viewList('pals');
                    }, false, true),
                    new ViewOption('Pending requests (' + matcherComponent.user.pendingRequests.length + ')', () => {
                        matcherComponent.viewList('pending-requests');
                    }, false, true),
                    new ViewOption('Sent requests', () => {
                        matcherComponent.viewList('sent-requests');
                    }, false, true)
                ]
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
            // new ViewAction(
            //     'Show more',
            //     () => {
            //         matcherComponent.find();
            //     },
            //     EViewAction.Primary,
            //     false,
            //     () => {
            //         return matcherComponent.view === 'discover';
            //     }
            // )
        ];
    }
}
