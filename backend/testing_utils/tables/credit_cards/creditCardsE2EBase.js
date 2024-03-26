const creditCardsE2EBase = {
    identifier: "credit_cards",
    data: [
                            {
                                "credit_card_number": "3555264663306000",
                                "ccv": "000",
                                "user_id_fkey": undefined,
                                "expiration": "0000"
                                
                            },
                            {
                                "credit_card_number": "3555264663306001",
                                "ccv": "001", 
                                "user_id_fkey": undefined,
                                "expiration": "0001",
                            },
                            {
                                "credit_card_number": "3555264663306002",
                                "ccv": "002",
                                "user_id_fkey": undefined,
                                "expiration": "0002",
                            },
                            {
                                "credit_card_number": "3555264663306003",
                                "ccv": "003",
                                "user_id_fkey": undefined,
                                "expiration": "0003",
                            },
                            {
                                "credit_card_number": "3555264663306004",
                                "ccv": "004",
                                "user_id_fkey": undefined,
                                "expiration": "0004",
                            },
                            {
                                "credit_card_number": "3555264663306005",
                                "ccv": "005",
                                "user_id_fkey": undefined,
                                "expiration": "0005",
                            },
                            {
                                "credit_card_number": "3555264663306006",
                                "ccv": "006",
                                "user_id_fkey": undefined,
                                "expiration": "0006",
                            },
                            {
                                "credit_card_number": "355526466330607",
                                "ccv": "007",
                                "user_id_fkey": undefined,
                                "expiration": "0007",
                            },
                            {
                                "credit_card_number": "355526466330608",
                                "ccv": "008",
                                "user_id_fkey": undefined,
                                "expiration": "0008",
                            },
                            {
                                "credit_card_number": "355526466330609",
                                "ccv": "009",
                                "user_id_fkey": undefined,
                                "expiration": "0009",
                            },
    ],

    fkeyReferences: [
        {
            identifier: "users",
            externalIndexes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
            internalIndexes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
        }
    ]
};

module.exports = creditCardsE2EBase;