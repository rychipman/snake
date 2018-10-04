use diesel::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct Score {
    pub id: usize,
    pub score: usize,
    pub email: String,
}

pub struct Greeting {
    pub id: i32,
    pub text: String,
}

impl Greeting {
    pub fn all(conn: &SqliteConnection) -> Vec<String> {
        use super::schema::greetings::dsl::*;
        let res = greetings.select(text).load::<String>(conn).unwrap();
        res
    }
}
