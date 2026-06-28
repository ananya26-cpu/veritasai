def score_record(flags: list) -> str:
    high_risk = [
        "DUMMY_EIN_DETECTED",
        "MISSING_EIN",
        "INVALID_EIN_FORMAT",
        "INCOME_ANOMALY_HIGH"
    ]
    medium_risk = [
        "SUSPICIOUS_BUSINESS_NAME",
        "INCOME_ANOMALY_LOW",
        "INVALID_INCOME",
        "UNRECOGNIZED_CARD_TYPE"
    ]

    if not flags:
        return "LOW"

    for flag in flags:
        if flag in high_risk:
            return "HIGH"

    for flag in flags:
        if flag in medium_risk:
            return "MEDIUM"

    return "LOW"


def get_risk_color(risk: str) -> str:
    colors = {
        "HIGH": "#FF4444",
        "MEDIUM": "#FFA500",
        "LOW": "#00FF00"
    }
    return colors.get(risk, "#FFFFFF")


def summarize_flags(flags: list) -> str:
    if not flags:
        return "No issues detected."
    return " | ".join(flags)
