from app.v1.routes.base_route import BaseRoute
import re

def pascal_to_snake(text):
    """
    Convert a PascalCase string to snake_case.
    """
    #Separates the transition of an uppercase letter followed by lowercase
    s1 = re.sub(r'(.)([A-Z][a-z]+)', r'\1_\2', text)
    # Separates the transition of a lowercase letter followed by an uppercase letter
    snake = re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', s1)
    return snake.lower()

def include_route(router, route_obj, prefix: str, tags: list):
    """
    Add a route to the router. If `route_obj` is a string, it creates a generic route using BaseRoute.
    If it's an imported route, it adds it directly.
    
    :param router: Main APIRouter object to include routes.
    :param route_obj: Either a string (model name) for generic routes or an imported route object.
    :param prefix: URL prefix for the route.
    :param tags: List of tags for the route.
    """
    if isinstance(route_obj, str):
        # Create a generic route using BaseRoute
        route_obj = pascal_to_snake(route_obj)
        generic_route = BaseRoute(model_name=route_obj)
        router.include_router(generic_route.router, prefix=prefix, tags=tags)
    else:
        # Include the imported route object
        router.include_router(route_obj, prefix=prefix, tags=tags)