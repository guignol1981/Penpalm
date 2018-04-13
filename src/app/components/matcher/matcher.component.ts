import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../models/user/user';
import {UserService} from '../../services/user.service';
import {NotificationsService} from 'angular2-notifications';

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

    constructor(private userService: UserService,
                private notificationService: NotificationsService) {
    }

    ngOnInit() {
        this.find();
    }

    find() {
        this.userService.find(this.findFilter).then((users: User[]) => {
            this.suggestedUsers = users;
        });
    }

    selectUser(user: User) {
        this.selectedUser = user;
    }

    selectOption(option) {
        this.selectedOption = option;
    }

    setLanguageFilter(language) {
        this.findFilter.language = language;
        this.find();
    }

    setCountryFilter(country) {
        this.findFilter.country = country;
        this.find();
    }

    backToList() {
        this.selectedUser = null;
    }

    sendRequest() {
        if (this.transacting) {
            return;
        }
        this.transacting = true;
        this.userService.sendRequest(this.selectedUser).then((user: User) => {
            this.selectedUser = user;
            this.notificationService.success('Request sent');
            this.transacting = false;
        });
    }

    cancelRequest() {
        if (this.transacting) {
            return;
        }
        this.transacting = true;
        this.userService.cancelRequest(this.selectedUser).then((user: User) => {
            this.selectedUser = user;
            this.notificationService.success('Request canceled');
            this.transacting = false;
        });
    }

    report() {

    }
}
