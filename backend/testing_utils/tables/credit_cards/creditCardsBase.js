const creditCardsBase = {
    identifier: "credit_cards",
    data: [
        {
            "credit_card_number": "3555264663306251",
            "ccv": "848",
            "user_id_fkey": undefined,
            "expiration": "0723"
        },
        {
            "credit_card_number": "5336010754365644",
            "ccv": "948",
            "user_id_fkey": undefined,
            "expiration": "0523"
        },
        {
            "credit_card_number": "633394720384097726",
            "ccv": "455",
            "user_id_fkey": undefined,
            "expiration": "0323"
        },
        {
            "credit_card_number": "3554120196532865",
            "ccv": "319",
            "user_id_fkey": undefined,
            "expiration": "0124"
        },
        {
            "credit_card_number": "3587119383780940",
            "ccv": "122",
            "user_id_fkey": undefined,
            "expiration": "0523"
        },
        {
            "credit_card_number": "3544950927775471",
            "ccv": "736",
            "user_id_fkey": undefined,
            "expiration": "0124"
        },
        {
            "credit_card_number": "304539605976770",
            "ccv": "307",
            "user_id_fkey": undefined,
            "expiration": "0124"
        },
        {
            "credit_card_number": "3531612933991766",
            "ccv": "859",
            "user_id_fkey": undefined,
            "expiration": "0523"
        },
        {
            "credit_card_number": "3538578353838055",
            "ccv": "975",
            "user_id_fkey": undefined,
            "expiration": "0623"
        },
        {
            "credit_card_number": "3571305637456878",
            "ccv": "757",
            "user_id_fkey": undefined,
            "expiration": "0523"
        }
    ],
    fkeyReferences: [
        {
            identifier: "users",
            externalIndexes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
            internalIndexes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
        }
    ]
};

module.exports = creditCardsBase;