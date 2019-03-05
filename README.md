# Midterm Assignment

[Midterm](https://bookclubweb.herokuapp.com/)


## Name of Resource and Attributes 

* Books
    * Title (title)
    * Author's Name (author)
    * Date (dated)
    * Rating (rating)
    * Completed (completed)
    * Image (image)

* Users
    * Name (name)
    * Email (email)

## Schema

### Books
Name | Types
---- | -----
title | String
author | String
dated | Date
rating | Number
completed | Boolean
image | String

### Users
Name | Types
---- | -----
name | String
email | String


## REST Endpoints

Name | HTTP Method | Path
---- | ----------- | ----
List All Books | GET | /books
List Completed Books | GET | /books?completed=true
List To Read Books | GET | /books?completed=false
List Top Rated Books | GET | /books?rating=3
Create | POST | /books
Create | POST | /users
Delete | DELETE | /books/:id


