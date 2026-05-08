from datetime import datetime
import random
import string


def generate_ticket_number() -> str:
    """
    Generate nomor tiket unik: TKT-YYYYMMDD-XXXXX
    Contoh: TKT-20250413-AB3F2
    """
    today = datetime.now().strftime("%Y%m%d")
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"TKT-{today}-{suffix}"
