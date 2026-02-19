from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .m_base import Base, BaseMixin


class User(Base, BaseMixin):
    __tablename__ = "users"

    firebase_uid: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)

    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String, nullable=False)
    last_name: Mapped[str] = mapped_column(String, nullable=False)
    phone: Mapped[str] = mapped_column(String, nullable=True)
    position: Mapped[str] = mapped_column(String, nullable=True)

    # Social links
    facebook: Mapped[str] = mapped_column(String, nullable=True)
    twitter: Mapped[str] = mapped_column(String, nullable=True)
    github: Mapped[str] = mapped_column(String, nullable=True)
    dribbble: Mapped[str] = mapped_column(String, nullable=True)

    # Address details
    location: Mapped[str] = mapped_column(String, nullable=True)
    state: Mapped[str] = mapped_column(String, nullable=True)
    pin: Mapped[str] = mapped_column(String, nullable=True)
    zip: Mapped[str] = mapped_column(String, nullable=True)
    tax_no: Mapped[str] = mapped_column(String, nullable=True)

    role: Mapped[str] = mapped_column(String, nullable=False, default="owner")
    group: Mapped[str] = mapped_column(String, nullable=False, default="coregroup")