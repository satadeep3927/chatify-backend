/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'ApiController.index');
Route.post('/register', 'ApiController.register');
Route.post('/login', 'ApiController.login');
Route.get('/users/:id', 'ApiController.users');
Route.get('/verify/:id', 'ApiController.verify');


Route.get('/messages/:id', 'ApiController.messages');
Route.get('/chats/:sender_id/:recipient_id', 'ApiController.getChats');
