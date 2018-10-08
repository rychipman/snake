use std::error::Error;
use diesel::prelude::*;
use diesel::insert_into;

use super::schema::scores;
use super::schema::scores::dsl::{scores as all_scores, score as scores_score};

#[derive(Insertable, Serialize, Deserialize)]
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
    pub fn all(conn: &SqliteConnection) -> Result<Vec<ScoreQuery>, impl Error> {
        all_scores
            .order(scores_score.desc())
            .load::<ScoreQuery>(conn)
    }

    pub fn top(limit: i64, conn: &SqliteConnection) -> Result<Vec<ScoreQuery>, impl Error> {
        all_scores
            .order(scores_score.desc())
            .limit(limit)
            .load::<ScoreQuery>(conn)
    }

    pub fn insert(score: ScoreInsert, conn: &SqliteConnection) -> Result<usize, impl Error> {
        insert_into(scores::table)
            .values(score)
            .execute(conn)
    }
}
