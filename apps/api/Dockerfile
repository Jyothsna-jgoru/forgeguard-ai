FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app
RUN addgroup --system forgeguard && adduser --system --ingroup forgeguard forgeguard
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY forgeguard ./forgeguard
RUN chown -R forgeguard:forgeguard /app
USER forgeguard
EXPOSE 8000
HEALTHCHECK --interval=15s --timeout=3s --retries=5 CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/v1/health')"
CMD ["uvicorn", "forgeguard.main:app", "--host", "0.0.0.0", "--port", "8000"]

