from fastapi import APIRouter, Form, HTTPException
import uuid

# We use APIRouter to group related tasks
router = APIRouter(
    prefix="/tickets",   # All URLs here start with /tickets
    tags=["Tickets"]     # Organizes the /docs page
)

@router.post("/submit")
async def submit_ticket(
    subject: str = Form(...),
    topic: str = Form(...),
    nim: str = Form(...),
    description: str = Form(...)
):
    # SECURITY TASK: Basic Input Validation
    # Ensure NIM is alpha-numeric (G64...) and not a malicious script
    if not nim.isalnum():
        raise HTTPException(status_code=400, detail="Invalid NIM format")

    ticket_id = f"TIC-{uuid.uuid4().hex[:6].upper()}"
    
    return {
        "status": "Success",
        "ticket_id": ticket_id,
        "message": "Ticket successfully received"
    }

@router.get("/list")
async def list_tickets():
    # Later, this will fetch from the Database
    return {"tickets": []}