use diesel::prelude::*;
use diesel::insert_into;

use super::schema::scores;
use super::schema::scores::dsl::{scores as all_scores};

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

    pub fn insert(&self, conn: &SqliteConnection) -> bool {
        insert_into(scores::table)
            .values(self)
            .execute(conn)
            .is_ok()
    }
}
