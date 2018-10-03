table! {
    greetings (id) {
        id -> Nullable<Integer>,
        text -> Text,
    }
}

table! {
    scores (id) {
        id -> Integer,
        score -> Integer,
        email -> Nullable<Text>,
    }
}

allow_tables_to_appear_in_same_query!(
    greetings,
    scores,
);
