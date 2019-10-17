import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { PortailService } from 'src/app/services/portail.service';
import { faTrash, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  userList;
  mode = 'list';
  currentUser;
  trashIcon = faTrash;
  plusIcon = faPlus;
  editIcon = faEdit;

  constructor(private portailService: PortailService, private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.portailService.getAllUsers()
        .subscribe(data => {
          this.userList = data;
        }, err => {
          console.error(err);
        });
  }

  onDeleteUser(user) {
    const conf = confirm('Etes-vous sûr de vouloir supprimer ?');
    if (!conf) { return; }
    this.portailService.deleteRessource(user._links.self.href)
        .subscribe(data => {
          this.getAllUsers();
        }, err => {
          console.error(err);
        });
  }

  onNewUser() {
    this.mode = 'new-user';
  }

  /* onSaveUser(data) {
    console.log('data : ', data);
    let url = this.portailService.BASE_URL + '/userApps';
    this.portailService.postRessource(url, data)
        .subscribe(data => {
          this.mode = 'list';
          this.getAllUsers();
        }, err => {
          console.error('failure', err);
        });
  } */

  onSaveUser(formData) {
    this.authService.register(formData)
        .subscribe(resp => {
          console.log('success ', resp);
          this.mode = 'list';
          this.getAllUsers();
          this.router.navigateByUrl('/adminUsers');
        }, err => {
          console.error('failure', err);
        });
  }

}
