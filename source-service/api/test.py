from fastapi import APIRouter

router = APIRouter()

@router.get('/', tags=['get'])
async def t1():
    return "t1t1t1"