

- Author - [Albert Vafaullin]
- Website - [https://m3312-vafaullin.onrender.com](https://m3312-vafaullin.onrender.com)
- Group - [M3312]
![ER](https://github.com/user-attachments/assets/2a0309da-97eb-44bc-86ce-ae6182922ed7)


USER : 


id | Int (PK)	 | Уникальный идентификатор пользователя (автоинкремент).


username | 	String	| Уникальное имя пользователя.

password | 	String | 	Хэшированный пароль пользователя.


email	| String	| Уникальный email пользователя.


role	| user_role_enum	| Роль пользователя: tenant (арендатор) или owner (владелец склада).


created_at | 	DateTime	| Дата создания учетной записи (по умолчанию текущее время).


reservation	| reservation[]	| Связь с бронированиями, сделанными пользователем.


review | 	review[] | 	Связь с отзывами пользователя.


WAREHOUSE : 

id	| Int (PK) | 	Уникальный идентификатор склада (автоинкремент).


location	| String | 	Адрес или описание местоположения склада.


capacity	| Int	| Вместимость склада (в кубометрах, квадратных метрах и т. д.).


price | 	Decimal(10,2)	| Цена аренды склада.


description | 	String?	 | Описание склада (необязательное поле).


reservation | reservation[] | 	Связь с бронированиями данного склада.


review | 	review[] | 	Связь с отзывами на этот склад.


RESERVATION : 

id	| Int (PK) | 	Уникальный идентификатор бронирования (автоинкремент).


start_date | 	DateTime	| Дата начала аренды.


end_date	| DateTime | 	Дата окончания аренды.


status	| reservation_status_enum	| Статус бронирования: pending (ожидание), confirmed (подтверждено), canceled (отменено).


userId | 	Int?	| Ссылка на пользователя, который арендовал склад.


warehouseId	| Int? | 	Ссылка на склад, который был арендован.


user | 	user?| 	Связь с пользователем.


warehouse | 	warehouse? | 	Связь со складом.

PAYMENT : 

id	| Int (PK)	| Уникальный идентификатор платежа (автоинкремент).


reservation_id |	Int	| Ссылка на бронирование, за которое был сделан платеж.


amount | 	Decimal(10,2)	| Сумма платежа.


status	| payment_status_enum | 	Статус платежа: pending (в ожидании), paid (оплачен), failed (ошибка оплаты).


paid_at	| DateTime?	| Дата и время оплаты (если оплачено).


REVIEW : 

id	| Int (PK)	| Уникальный идентификатор отзыва.


rating	| Int	| Оценка от 1 до 5.


comment	| String?	| Текстовый комментарий (необязательное поле).


created_at	| DateTime	| Дата и время создания отзыва.


userId	| Int? | 	Ссылка на пользователя, оставившего отзыв.


warehouseId	| Int?	| Ссылка на склад, к которому относится отзыв.


user	| user? | 	Связь с пользователем.


warehouse	| warehouse?	| Связь со складом. 



USER_ROLE_ENUM : 


tenant - арендатор.
owner - владелец.

RESERVATION_STATUS_ENUM : 

pending - в ожидании.
confirmed - подтвержденно.
canceled - отменено.

PAYMENT_STATUS_ENUM : 

pending - в ожидании.
paid - оплачено.
failed - ошибка платежа.








