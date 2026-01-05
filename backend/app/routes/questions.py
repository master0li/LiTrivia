from fastapi import APIRouter
import httpx

router = APIRouter(prefix="/questions", tags=["questions"])


@router.get("/")
async def get_question(site: int = 1):

    url = "https://opentdb.com/api.php?amount=1"

    match site:
        case 1:
            url = "https://opentdb.com/api.php?amount=1"
        case 2:
            url = "https://opentdb.com/api.php?amount=1&difficulty=easy"
        case 3:
            url = "https://opentdb.com/api.php?amount=1&difficulty=hard"
        case _:
            url = "https://opentdb.com/api.php?amount=1"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
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
