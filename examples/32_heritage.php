<?php

class User extends Model
{

    public function create($name, $email)
    {
        DB::table('users')->insert(['name' => $name, 'email' => $email]);
    }

    public function find($id)
    {
        $user = User::find($id);
        return $user;
    }

    public function raw_query()
    {
        $pdo->query("SELECT * FROM logs");
    }
}
