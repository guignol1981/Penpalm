import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../models/user/user';
import {UserService} from '../../services/user.service';
import {NotificationsService} from 'angular2-notifications';
import {Notif} from '../home/home.component';

export interface FindFilter {
    country: string;
    language: string;
}

@Component({
    selector: 'app-matcher',
    templateUrl: './matcher.component.html',
    styleUrls: ['./matcher.component.scss']
})
export class MatcherComponent implements OnInit {
    @Input() user: User;
    @Output() notifEvent: EventEmitter<Notif> = new EventEmitter<Notif>();

    suggestedUsers: User[];
    selectedOption = '';
    selectedUser: User;
    countryList = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad &amp; Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'];
    languageList = ['French', 'English', 'Spanish'];
    findFilter = {
        country: 'none',
        language: 'none'
    };
    transacting = false;
    view = 'discover';

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.find();
    }

    find(callback ?: any) {
        this.userService.find(this.findFilter).then((users: User[]) => {
            this.suggestedUsers = users;
            if (callback) {
                callback();
            }
        });
    }

    selectUser(user: User) {
        this.selectedUser = user;
        this.view = 'details';
    }

    selectOption(option) {
        this.selectedOption = option;
    }

    setLanguageFilter(language) {
        let me = this;
        let msg = language === 'none' ? 'Filter cleared' : 'Filter applied';

        this.findFilter.language = language;

        let displayMsg = function () {
            me.notifEvent.emit({type: 'success', msg: msg});
        };
        this.find(displayMsg);
    }

    setCountryFilter(country) {
        let me = this;
        let msg = country === 'none' ? 'Filter cleared' : 'Filter applied';

        this.findFilter.country = country;

        let displayMsg = function () {
            me.notifEvent.emit({type: 'success', msg: msg});
        };
        this.find(displayMsg);
    }

    viewList() {
        this.selectedUser = null;
        this.view = 'discover';
        this.find();
    }

    sendRequest() {
        if (this.transacting) {
            return;
        }
        this.transacting = true;
        this.userService.sendRequest(this.selectedUser).then((user: User) => {
            this.selectedUser = user;
            this.transacting = false;
            this.notifEvent.emit({type: 'success', msg: 'Request sent'});
        });
    }

    cancelRequest() {
        if (this.transacting) {
            return;
        }

        this.transacting = true;
        this.userService.cancelRequest(this.selectedUser).then((user: User) => {
            this.selectedUser = user;
            this.notifEvent.emit({type: 'success', msg: 'Request canceled'});
            this.transacting = false;
        });
    }

    handleRequest(accept: boolean) {
        this.userService.handleRequest(this.selectedUser, accept).then((response: any) => {
            if (accept) {
                console.log(this.user);
                this.notifEvent.emit({type: 'success', msg: 'Pal added'});
                this.selectedUser = response.targetUser;
                this.user = response.sourceUser;
            } else {
                this.notifEvent.emit({type: 'success', msg: 'Request rejected'});
            }
        });
    }

    viewPals() {
        if (this.transacting) {
            return;
        }

        this.view = 'pals';
    }

    viewPendingRequests() {
        if (this.transacting) {
            return;
        }

        this.view = 'pending-requests';

        this.transacting = true;
        this.userService.getPendingRequests().then((users: User[]) => {
            this.suggestedUsers = users;
            this.transacting = false;
        });
    }

    viewRequests() {
        if (this.transacting) {
            return;
        }

        this.view = 'sent-requests';

        this.transacting = true;
        this.userService.getRequests().then((users: User[]) => {
            this.suggestedUsers = users;
            this.transacting = false;
        });
    }

    removeFromPals() {

    }

    manage() {

    }

    report() {

    }
}
