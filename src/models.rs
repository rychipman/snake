use diesel::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct Score {
    pub id: usize,
    pub score: usize,
    pub email: String,
}

#[derive(Queryable, Debug)]
pub struct Greeting {
    pub id: Option<i32>,
    pub text: String,
}

impl Greeting {
    pub fn all(conn: &SqliteConnection) -> Vec<Greeting> {
        use super::schema::greetings::dsl::*;
        let res = greetings.load::<Greeting>(conn).unwrap();
        res
    }
}
