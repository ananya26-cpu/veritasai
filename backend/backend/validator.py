DUMMY_EINS = [
    "123456788", "123456789", "000000000", "111111111",
    "222222222", "333333333", "999999999", "123456780"
]

def validate_record(record: dict) -> list:
    flags = []

    # EIN checks
    ein = str(record.get("ein", "")).strip()
    if not ein:
        flags.append("MISSING_EIN")
    elif ein in DUMMY_EINS:
        flags.append("DUMMY_EIN_DETECTED")
    elif len(ein) != 9 or not ein.isdigit():
        flags.append("INVALID_EIN_FORMAT")

    # Business name checks
    name = str(record.get("business_name", "")).strip()
    if not name:
        flags.append("MISSING_BUSINESS_NAME")
    elif len(name) < 3:
        flags.append("SUSPICIOUS_BUSINESS_NAME")

    # Income checks
    try:
        income = float(record.get("income", 0))
        if income <= 0:
            flags.append("INVALID_INCOME")
        elif income > 50000000:
            flags.append("INCOME_ANOMALY_HIGH")
        elif income < 1000:
            flags.append("INCOME_ANOMALY_LOW")
    except:
        flags.append("MISSING_INCOME")

    # Card type checks
    card_type = str(record.get("card_type", "")).strip()
    valid_cards = ["Business Gold", "Business Platinum", "Blue Business Cash", "Business Green"]
    if not card_type:
        flags.append("MISSING_CARD_TYPE")
    elif card_type not in valid_cards:
        flags.append("UNRECOGNIZED_CARD_TYPE")

    return flags
