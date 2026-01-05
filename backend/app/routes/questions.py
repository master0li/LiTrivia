from fastapi import APIRouter
import httpx

router = APIRouter(prefix="/questions", tags=["questions"])

@router.get("/")
async def get_question():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://opentdb.com/api.php?amount=1")
            response.raise_for_status()
            res = response.json()

            first_question = res["results"][0]

            data = {
                "question": first_question["question"],
                "correct_answer": first_question["correct_answer"],
                "incorrect_answers": first_question["incorrect_answers"]
            }

            return data
    except (KeyError, IndexError) as e:
        return {"error": f"Error: {str(e)}"}
    except httpx.TimeoutException:
        return {"error": "API timeout"}
    except httpx.HTTPError as e:
        return {"error": f"API error: {str(e)}"}
