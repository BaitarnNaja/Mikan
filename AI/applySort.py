def apply_sorting(results_list: list, sort_type: str) -> list:
    if not results_list or not sort_type:
        return results_list

    if sort_type == "new":
        results_list = sorted(results_list, key=lambda x: x.get('score', 0))
    
    if sort_type == "relevance":
        results_list.reverse()

    elif sort_type == "az":
        results_list = sorted(results_list, key=lambda x: x.get('productName', '').lower())

    elif sort_type == "za":
        results_list = sorted(results_list, key=lambda x: x.get('productName', '').lower(), reverse=True)

    elif sort_type == "price_low":
        results_list = sorted(results_list, key=lambda x: x['price'].get('amount', 0))

    elif sort_type == "price_high":
        results_list = sorted(results_list, key=lambda x: x['price'].get('amount', 0), reverse=True)

    elif sort_type == "date_old":
        results_list = sorted(results_list, key=lambda x: x.get('add_date', ""), reverse=True)

    elif sort_type == "date_new":
        results_list = sorted(results_list, key=lambda x: x.get('add_date', ""))

    return results_list