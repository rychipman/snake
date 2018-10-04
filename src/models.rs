use diesel::prelude::*;
use diesel::insert_into;

use super::schema::scores;
use super::schema::scores::dsl::{scores as all_scores};

#[derive(Insertable, Deserialize)]
#[table_name = "scores"]
pub struct ScoreInsert {
    pub id: Option<i32>,
    pub score: i32,
    pub email: Option<String>,
}

#[derive(Serialize, Queryable, Debug)]
pub struct ScoreQuery {
    pub id: i32,
    pub score: i32,
    pub email: Option<String>,
}

pub struct Score ();

impl Score {
    pub fn all(conn: &SqliteConnection) -> Vec<ScoreQuery> {
        all_scores.load::<ScoreQuery>(conn).unwrap()
    }

    pub fn insert(score: ScoreInsert, conn: &SqliteConnection) -> bool {
        insert_into(scores::table)
            .values(score)
            .execute(conn)
            .is_ok()
    }
}
