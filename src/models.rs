use diesel::prelude::*;
use diesel::insert_into;

use super::schema::scores;
use super::schema::scores::dsl::{scores as all_scores};

use super::schema::greetings;
use super::schema::greetings::dsl::{greetings as all_greetings};

#[derive(Serialize, Deserialize, Queryable, Insertable, Debug)]
pub struct Score {
    pub id: i32,
    pub score: i32,
    pub email: Option<String>,
}

impl Score {
    pub fn all(conn: &SqliteConnection) -> Vec<Score> {
        all_scores.load::<Score>(conn).unwrap()
    }
}

#[derive(Queryable, Insertable, Debug)]
pub struct Greeting {
    pub id: Option<i32>,
    pub text: String,
}

impl Greeting {
    pub fn all(conn: &SqliteConnection) -> Vec<Greeting> {
        all_greetings.load::<Greeting>(conn).unwrap()
    }

    pub fn insert(msg: Greeting, conn: &SqliteConnection) -> bool {
        insert_into(greetings::table)
            .values(msg)
            .execute(conn)
            .is_ok()
    }
}
