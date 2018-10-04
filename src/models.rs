use diesel::prelude::*;
use diesel::insert_into;

use super::schema::greetings;
use super::schema::greetings::dsl::{greetings as all_greetings};

#[derive(Serialize, Deserialize)]
pub struct Score {
    pub id: usize,
    pub score: usize,
    pub email: String,
}

#[derive(Queryable, Insertable, Debug)]
pub struct Greeting {
    pub id: Option<i32>,
    pub text: String,
}

impl Greeting {
    pub fn all(conn: &SqliteConnection) -> Vec<Greeting> {
        let res = all_greetings.load::<Greeting>(conn).unwrap();
        res
    }

    pub fn insert(msg: Greeting, conn: &SqliteConnection) -> bool {
        insert_into(greetings::table)
            .values(msg)
            .execute(conn)
            .is_ok()
    }
}
