from fastapi import APIRouter

router = APIRouter()

@router.get('/')
async def t1():
    return "t1t1t1"