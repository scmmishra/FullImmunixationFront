import {Component, OnInit, Input} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import { SearchService } from '../search.service';
import {ArrayType} from '@angular/compiler/src/output/output_ast';


@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
    public mother: object;
    public child: object;
    public model: string;
    public children;
    public profileList: any[];
    public makeVisible: boolean = false;

    constructor(
        private http: Http,
        private route: ActivatedRoute,
        private router: Router,
        private searchServ: SearchService
    ) {
        this.route.params.subscribe(params => {
            if (params.model == 'child') {
                this.model = 'child';
                this.child = params;
                console.log(this.child);
            } else if (params.model == 'mother') {
                this.model = 'mother';
                this.mother = params;
                console.log(
                    'http://localhost:8000/api/mothers/' +
                        this.mother['pk'] +
                        '/children/'
                );
                this.getChildren();
            }
        });
    }

    search(id: string){
        if (id != "") {
            this.makeVisible = true;
            let first_name = "";
            let last_name = "";
            console.log(id);
            this.searchServ.searchMother(id, first_name, last_name).subscribe(data => {
                this.profileList = data.json().data;
                console.log(data.json().data);
                /*this.searchServ.getKids(this.profileList[0].pk).subscribe(
                    data => {console.log(data);}
                )*/
            },
                error => {console.log("Error")});
        } else {
            console.log("====");
            console.log(this.profileList);
            this.makeVisible = false;
            let profileList = [];
        }
    }

    immunizeChild(primk){
        console.log(primk);
        this.router.navigate(['/immunization', primk])
        this.searchServ.searchMother(primk, "", "").subscribe(data => {this.profileList = data.json().data; console.log(data.json().data)});
    }
    viewChildProfile(kid) {
        console.log('Redirecting to Profile Page');
        console.log(kid);
        kid['model'] = 'child';
        this.router.navigate(['/user-profile', kid]);
    }
    getChildren() {
        this.http
            .get(
                'http://localhost:8000/api/mothers/' +
                    this.mother['pk'] +
                    '/children/'
            )
            .subscribe(data => {
                this.children = data.json().data.fields.children;
                // this.children = JSON.stringify(data.json().data.fields.children);
                console.log(typeof this.children[0]);
                console.log(this.children[0]);
            });
    }

    ngOnInit() {}

    addChild(pk) {
        this.router.navigate([
            '/registration',
            {model: 'child', mother_id: pk},
        ]);
    }

    viewProfileDelta(motherModel, mother_pk){
        motherModel['pk'] = mother_pk;
        motherModel['model'] = 'mother';
        this.router.navigate(['/user-profile', motherModel]);
    }
    editMother(mother) {
        console.log(mother);
        this.router.navigate(['/registration'], mother); //add mother object as input here
    }

}
